package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrderHandlers struct {
	DB *gorm.DB
}

// getOrderIDFromParams parses the order id from the param string.
func (oh *OrderHandlers) getOrderIDFromParams(c *gin.Context) (int, error) {
	orderIdStr := c.Param("orderId")

	if len(orderIdStr) == 0 {
		return 0, errors.New("Invalid or no order id")
	}

	orderId, err := strconv.Atoi(orderIdStr)

	if err != nil {
		return 0, err
	}

	return orderId, nil
}

// GetOrderByID retrieves an order by its id.
func (oh *OrderHandlers) GetOrderByID(orderId int) (*OrderJSON, float64, error) {
	if orderId <= 0 {
		return nil, 0, errors.New("Invalid order id")
	}

	order := &Order{}

	result := oh.DB.
		Preload("OrderProducts.Product").
		Where("orders.id = ?", orderId).
		Find(&order)

	if result.RowsAffected < 0 {
		return nil, 0, errors.New("No such order")
	}

	orderJSON := &OrderJSON{
		ID:        order.ID,
		CreatedAt: order.CreatedAt,
	}
	totalCost := 0.0

	for _, orderProduct := range order.OrderProducts {
		if orderProduct.Product.ID == 0 {
			continue
		}

		totalCost += orderProduct.Product.Price

		productJSON := ProductJSON{
			ID:    orderProduct.Product.ID,
			Name:  orderProduct.Product.Name,
			Type:  orderProduct.Product.Type,
			Price: orderProduct.Product.Price,
		}
		orderJSON.Products = append(orderJSON.Products, productJSON)
	}

	return orderJSON, totalCost, nil
}

// CreateOrder handles the creation/placement of an order.
func (oh *OrderHandlers) CreateOrder(c *gin.Context) {
	var productIds []uint64
	response := &ApiResponse{}

	products := c.PostForm("products")
	err := json.Unmarshal([]byte(products), &productIds)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusBadRequest, response)
		return
	}

	if len(productIds) == 0 {
		response.Success = false
		response.Error = "Can't make an empty order"
		c.JSON(http.StatusBadRequest, response)
		return
	}

	var dbProducts []Product
	var jsonProducts *[]ProductJSON
	newOrder := &Order{
		CreatedAt: time.Now(),
	}

	// Create the new order.
	oh.DB.Create(newOrder).Commit()

	result := oh.DB.
		Where("id in (?)", productIds).
		Find(&dbProducts)

	if result.RowsAffected == 0 {
		response.Success = false
		response.Error = "Invalid product ids"

		c.JSON(http.StatusBadRequest, response)

		return
	}

	// Create all order products.
	for _, product := range dbProducts {
		oh.DB.Create(&OrderProduct{
			ProductID: product.ID,
			OrderID:   newOrder.ID,
		}).Commit()
	}

	// With the products that were find, create a new set of order products,
	// and use the order that was created earlier, to create the association.

	jsonProducts = ProductsToJSONFormat(dbProducts)
	orderJSON := &OrderJSON{
		ID:        newOrder.ID,
		CreatedAt: newOrder.CreatedAt,
		Products:  *jsonProducts,
	}

	response.Success = true
	response.Data = orderJSON

	c.JSON(http.StatusOK, response)
}

// PrintOrder is supposed to return the order and also print the receipt for it.
func (oh *OrderHandlers) PrintOrder(c *gin.Context) {
	response := &ApiResponse{}
	orderId, err := oh.getOrderIDFromParams(c)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	orderJSON, totalCost, err := oh.GetOrderByID(orderId)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
	}

	response.Data = gin.H{
		"order_id": orderId,
		"order":    orderJSON,
		"total":    totalCost,
	}
	response.Success = true
	c.JSON(http.StatusOK, response)
}
