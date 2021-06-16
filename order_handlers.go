package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrderHandlers struct {
	DB *gorm.DB
}

func (oh *OrderHandlers) CreateOrder(c *gin.Context) {
	apiResponse := ApiResponse{
		Data: gin.H{
			"test": 123,
		},
		Success: true,
		Error:   "",
	}
	c.JSON(http.StatusOK, apiResponse)
}

func (oh *OrderHandlers) PrintOrder(c *gin.Context) {
	orderIdStr := c.Param("orderId")
	response := &ApiResponse{}

	if len(orderIdStr) == 0 {
		response.Success = false
		response.Error = "Invalid or no order id"
		c.JSON(http.StatusOK, response)
		return
	}

	orderId, err := strconv.Atoi(orderIdStr)

	if orderId <= 0 {
		response.Success = false
		response.Error = "Invalid order id"
		c.JSON(http.StatusOK, response)
		return
	} else if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	order := &Order{}

	result := oh.DB.
		Preload("OrderProducts.Product").
		Where("orders.id = ?", orderId).
		Find(&order)

	if result.RowsAffected < 0 {
		response.Success = false
		response.Error = "No such order"
		c.JSON(http.StatusOK, response)
		return
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

	order.OrderProducts = nil

	apiResponse := ApiResponse{
		Data: gin.H{
			"order_id": orderId,
			"order":    orderJSON,
			"total":    totalCost,
		},
		Success: true,
		Error:   "",
	}
	c.JSON(http.StatusOK, apiResponse)
}
