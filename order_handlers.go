package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/360EntSecGroup-Skylar/excelize"
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
		Cancelled: order.Cancelled == 1,
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

	var orderProducts []OrderProduct

	for _, product := range dbProducts {
		for _, productId := range productIds {
			if productId == product.ID {
				orderProducts = append(orderProducts, OrderProduct{
					ProductID: product.ID,
					OrderID:   newOrder.ID,
				})
			}
		}
	}

	// Batch-create all order products.
	oh.DB.Create(&orderProducts).Commit()

	// With the products that were find, create a new set of order products,
	// and use the order that was created earlier, to create the association.

	jsonProducts = ProductsToJSONFormat(dbProducts)
	orderJSON := &OrderJSON{
		ID:        newOrder.ID,
		Cancelled: false,
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
		return
	}

	response.Data = gin.H{
		"order_id": orderId,
		"order":    orderJSON,
		"total":    totalCost,
	}
	response.Success = true
	c.JSON(http.StatusOK, response)
}

// GetOrders returns a list of orders.
func (oh *OrderHandlers) GetOrders(c *gin.Context) {
	pageStr, exists := c.GetQuery("p")
	page := 1
	response := &ApiResponse{}

	if exists {
		page, _ = strconv.Atoi(pageStr)

		if page < 1 {
			page = 1
		}
	}

	var orders []Order
	var dataOrders []interface{}

	oh.DB.
		Preload("OrderProducts.Product").
		Order("id desc").
		Limit(50).
		Offset((page - 1) * 30).
		Find(&orders)

	// Convert all orders to the JSON format.
	for _, order := range orders {
		orderJSON := OrderJSON{
			ID:        order.ID,
			Cancelled: order.Cancelled == 1,
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

		dataOrders = append(dataOrders, gin.H{
			"order_id": order.ID,
			"order":    orderJSON,
			"total":    totalCost,
		})
	}

	response.Success = true
	response.Data = dataOrders

	c.JSON(http.StatusOK, response)
}

// GetTotalEarnings just returns the total earnings year-to-date.
func (oh *OrderHandlers) GetTotalEarnings(c *gin.Context) {
	response := ApiResponse{}
	totalSales := 0.0
	var orders []Order

	// Get the list of orders.
	oh.DB.
		Where("created_at > DATE('now', 'start of year')").
		Where("cancelled = 0").
		Preload("OrderProducts.Product").
		Find(&orders)

	for _, order := range orders {
		for _, orderProduct := range order.OrderProducts {
			totalSales += orderProduct.Product.Price
		}
	}

	response.Success = true
	response.Data = totalSales

	c.JSON(http.StatusOK, response)
}

// ExportTotalEarnings returns the total earnings for day or year to date.
func (oh *OrderHandlers) ExportTotalEarnings(c *gin.Context) {
	// Get total earnings for day or year to date.
	xlsx := excelize.NewFile()
	dt := time.Now()
	fileName := "ytd-export_" + dt.String() + ".xlsx"
	var orders []Order
	var products []Product
	var productCols map[string]string = make(map[string]string)

	// Get the list of products.
	oh.DB.Find(&products)

	// Get the list of orders.
	oh.DB.
		Where("created_at > DATE('now', 'start of year')").
		Where("cancelled = 0").
		Preload("OrderProducts.Product").
		Find(&orders)

	xlsx.NewSheet("Sheet2")

	for idx, product := range products {
		col := IntToColumnString(int64(idx) + 2)
		xlsx.SetCellValue("Sheet2", col+"1", product.Name)
		productCols[product.Name] = col
	}

	xlsx.SetCellValue("Sheet1", "A1", "ID")
	xlsx.SetCellValue("Sheet1", "B1", "Order Total")
	xlsx.SetCellValue("Sheet1", "C1", "Created At")

	lastTotalCol := IntToColumnString(int64(len(products)) + 2)
	totalOrders := strconv.Itoa(len(orders) + 1)
	totalPos := strconv.Itoa(len(orders) + 2)

	// Styles for specific columns.
	dateExp := `{"custom_number_format": "m/d/yy h:mm AM/PM;@"}`
	dateStyle, _ := xlsx.NewStyle(dateExp)
	dollarExp := `{"number_format": 166,"font":{"bold":true}}`
	dollarStyle, _ := xlsx.NewStyle(dollarExp)
	totalStyle, _ := xlsx.NewStyle(`{
		"font": {
			"bold": true,
			"size": 10
		}
	}`)

	for idx, order := range orders {
		where := strconv.Itoa(idx + 2)
		orderTotal := 0.0

		for _, orderProduct := range order.OrderProducts {
			product := orderProduct.Product
			productCell := productCols[product.Name]
			typeTotal := 1

			orderTotal += product.Price

			val := xlsx.GetCellValue("Sheet2", productCell+where)

			if len(val) > 0 {
				intVal, _ := strconv.Atoi(val)
				typeTotal += intVal
			}

			xlsx.SetCellValue("Sheet2", productCell+where, typeTotal)
		}

		xlsx.SetCellValue("Sheet2", "A"+where, order.ID)

		xlsx.SetCellValue("Sheet1", "A"+where, order.ID)
		xlsx.SetCellValue("Sheet1", "B"+where, orderTotal)
		xlsx.SetCellValue("Sheet1", "C"+where, order.CreatedAt)

		xlsx.SetCellStyle("Sheet1", "B"+where, "B"+where, dollarStyle)
		xlsx.SetCellStyle("Sheet1", "C"+where, "C"+where, dateStyle)
	}

	xlsx.SetCellValue("Sheet2", "A1", "Order ID")
	xlsx.SetCellValue("Sheet2", "A"+totalPos, "Totals=")

	for _, product := range products {
		col := productCols[product.Name]
		target := col + totalPos
		formula := "SUM(" + col + "2:" + col + totalOrders + ")"

		xlsx.SetCellFormula("Sheet2", target, formula)
	}

	xlsx.SetColWidth("Sheet1", "B", "B", 12)
	xlsx.SetColWidth("Sheet1", "C", "C", 20)
	xlsx.SetColWidth("Sheet1", "F", "F", 20)
	xlsx.SetCellStyle("Sheet2", "A"+totalPos, lastTotalCol+totalPos, totalStyle)

	xlsx.SetCellValue("Sheet1", "E2", "Total=")
	xlsx.SetCellFormula("Sheet1", "F2", "SUM(B2:B"+totalOrders+")")
	xlsx.SetCellStyle("Sheet1", "F2", "F2", dollarStyle)
	xlsx.SaveAs("exports/" + fileName)

	targetPath := filepath.Join("exports/", fileName)

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+fileName)
	c.Header("Content-Type", "application/octet-stream")

	c.File(targetPath)
}

// ToggleOrder toggles the cancelled field of an order.
func (oh *OrderHandlers) ToggleOrder(c *gin.Context) {
	response := &ApiResponse{}
	orderId, err := oh.getOrderIDFromParams(c)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	orderJSON, _, err := oh.GetOrderByID(orderId)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		return
	}

	if orderJSON.ID == 0 {
		response.Success = false
		response.Error = "Invalid order id"
		return
	}

	var cancelled uint8 = 0

	if orderJSON.Cancelled {
		cancelled = 1
	}

	// Invert it.
	cancelled = (cancelled + 1) % 2

	order := &Order{
		ID:        orderJSON.ID,
		Cancelled: cancelled,
		CreatedAt: orderJSON.CreatedAt,
	}

	// Delete the order by the primary key (the id).
	oh.DB.Save(order).Commit()

	response.Success = true
	c.JSON(http.StatusOK, response)
}
