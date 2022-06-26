package main

import (
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/360EntSecGroup-Skylar/excelize"
	"github.com/asaskevich/EventBus"
	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	"github.com/skip2/go-qrcode"
	"github.com/wisepythagoras/pos-system/crypto"
	"gorm.io/gorm"
)

type OrderHandlers struct {
	DB     *gorm.DB
	Config *Config
	Bus    EventBus.Bus
}

// GetOrderByID retrieves an order by its id.
func (oh *OrderHandlers) GetOrderByID(orderId int) (*OrderJSON, float64, error) {
	if orderId <= 0 {
		return nil, 0, errors.New("invalid order id")
	}

	order := &Order{}

	result := oh.DB.
		Preload("OrderProducts.Product").
		Where("orders.id = ?", orderId).
		Find(&order)

	if result.RowsAffected < 0 {
		return nil, 0, errors.New("no such order")
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

		productJSON := OrderProductJSON{
			ID:           orderProduct.Product.ID,
			Name:         orderProduct.Product.Name,
			Type:         orderProduct.Product.Type,
			Price:        orderProduct.Product.Price,
			Discontinued: orderProduct.Product.Discontinued == 1,
			SoldOut:      orderProduct.Product.SoldOut == 1,
			Fulfilled:    orderProduct.Fulfilled == 1,
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
	var jsonProducts []OrderProductJSON
	newOrder := &Order{
		CreatedAt: time.Now(),
	}

	// Create the new order.
	oh.DB.Create(newOrder).Commit()

	// The original productIds array can contain multiple of the same product id. Just to be
	// more efficient, I get the unique ids.
	uniqueProductIds := lo.Uniq(productIds)

	result := oh.DB.
		Where("id in (?) AND discontinued = 0 AND sold_out = 0", uniqueProductIds).
		Find(&dbProducts)

	if result.RowsAffected == 0 {
		response.Success = false
		response.Error = "Invalid product ids"

		c.JSON(http.StatusBadRequest, response)

		return
	}

	var orderProducts []OrderProduct
	var productsArr []Product
	jsonProducts = make([]OrderProductJSON, 0)

	for _, productId := range productIds {
		product, productFound := lo.Find(dbProducts, func(p Product) bool {
			return p.ID == productId
		})

		if productFound {
			orderProducts = append(orderProducts, OrderProduct{
				ProductID: product.ID,
				OrderID:   newOrder.ID,
			})
			productsArr = append(productsArr, product)
			jsonProducts = append(jsonProducts, OrderProductJSON{
				ID:           product.ID,
				Name:         product.Name,
				Price:        product.Price,
				Type:         product.Type,
				Discontinued: product.Discontinued == 0,
				SoldOut:      product.SoldOut == 0,
				Fulfilled:    false,
			})
		}
	}

	// Batch-create all order products.
	oh.DB.Create(&orderProducts).Commit()

	// With the products that were find, create a new set of order products,
	// and use the order that was created earlier, to create the association.
	orderJSON := &OrderJSON{
		ID:        newOrder.ID,
		Cancelled: false,
		CreatedAt: newOrder.CreatedAt,
		Products:  jsonProducts,
	}

	response.Success = true
	response.Data = orderJSON

	oh.Bus.Publish("order_updates", orderJSON)

	c.JSON(http.StatusOK, response)
}

// FetchOrder is supposed to fetch and return the order with the giver id.
func (oh *OrderHandlers) FetchOrder(c *gin.Context) {
	response := &ApiResponse{}
	orderId, err := getIDFromParams("orderId", c)

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

	encryptJSON := `{"i": ` + strconv.Itoa(orderId) + `}`
	encryptedId, _ := crypto.EncryptGCM([]byte(encryptJSON), []byte(oh.Config.Key))

	response.Data = gin.H{
		"order_id": orderId,
		"e_id":     hex.EncodeToString(encryptedId),
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
		Offset((page - 1) * 50).
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

			productJSON := OrderProductJSON{
				ID:           orderProduct.Product.ID,
				Name:         orderProduct.Product.Name,
				Type:         orderProduct.Product.Type,
				Price:        orderProduct.Product.Price,
				Discontinued: orderProduct.Product.Discontinued == 1,
				SoldOut:      orderProduct.Product.SoldOut == 1,
				Fulfilled:    orderProduct.Fulfilled == 1,
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

// OrdersPastYear returns all orders from the past year.
func (oh *OrderHandlers) OrdersPastYear(c *gin.Context) {
	response := &ApiResponse{}
	var orders []Order
	var products []Product
	productMap := make(map[uint64]Product)

	oh.DB.
		Where("created_at > DATE('now', '-1 year')").
		Where("cancelled = 0").
		Find(&orders)

	// Get the list of products.
	oh.DB.Find(&products)

	orders = lo.Map(orders, func(o Order, i int) Order {
		var orderProducts []OrderProduct
		oh.DB.Where("order_id = ?", o.ID).Find(&orderProducts)
		o.OrderProducts = orderProducts

		return o
	})

	for _, p := range products {
		productMap[p.ID] = p
	}

	ordersJSON := lo.Map(orders, func(o Order, i int) OrderJSON {
		products := lo.Map(o.OrderProducts, func(op OrderProduct, i int) OrderProductJSON {
			product := productMap[op.ProductID]

			return OrderProductJSON{
				ID:        product.ID,
				Price:     product.Price,
				Fulfilled: op.Fulfilled == 1,
			}
		})

		return OrderJSON{
			ID:        o.ID,
			Cancelled: o.Cancelled == 1,
			CreatedAt: o.CreatedAt,
			Products:  products,
		}
	})

	response.Success = true
	response.Data = ordersJSON

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

	pastDay := c.Request.URL.Query().Get("day")
	exportClause := "created_at > DATE('now', 'start of year')"

	if pastDay == "1" || pastDay == "true" {
		exportClause = "created_at > DATE('now', 'start of day')"
	}

	// Get the list of products.
	oh.DB.Find(&products)

	// Get the list of orders.
	oh.DB.
		Where(exportClause).
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
	orderId, err := getIDFromParams("orderId", c)

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

// EarningsPerDay returns the total dollar earnings for each day. "0" is for the current
// day, "1" is for yesterday, "2" is 2 days ago, and so forth.
func (oh *OrderHandlers) EarningsPerDay(c *gin.Context) {
	type PerDayEarnings struct {
		Earnings float64
	}

	var results PerDayEarnings
	response := ApiResponse{}
	dayParam := c.Param("day")
	day, err := strconv.Atoi(dayParam)

	if err != nil || day < 0 {
		response.Success = false
		response.Error = "Invalid day"

		c.JSON(http.StatusBadRequest, response)

		return
	}

	if day == 0 {
		oh.DB.Raw(`
			select sum(p.price) earnings from order_products op
			left join products p on p.id = op.product_id
			left join orders o on o.id = op.order_id
			where
				op.created_at >= date('now', 'start of day') and
				o.cancelled = 0
			order by op.id desc;
		`).Scan(&results)
	} else {
		oh.DB.Raw(`
			select sum(p.price) earnings from order_products op
			left join products p on p.id = op.product_id
			left join orders o on o.id = op.order_id
			where
				op.created_at >=
					date('now', 'start of day', '-` + dayParam + ` day') and
				op.created_at <= date('now', 'start of day', '-` + strconv.Itoa(day-1) + ` day') and
				o.cancelled = 0
			order by op.id desc;
		`).Scan(&results)
	}

	response.Success = true
	response.Data = results.Earnings

	c.JSON(http.StatusOK, response)
}

// PublicOrder takes in an encrypted order id and retrieves the order.
func (oh *OrderHandlers) PublicOrder(c *gin.Context) {
	response := &ApiResponse{}
	orderIdBin, err := hex.DecodeString(c.Param("orderId"))

	if err != nil {
		response.Success = false
		response.Error = err.Error()

		c.JSON(http.StatusBadRequest, response)

		return
	}

	orderIdData, err := crypto.DecryptGCM(orderIdBin, []byte(oh.Config.Key))

	if err != nil {
		response.Success = false
		response.Error = err.Error()

		c.JSON(http.StatusBadRequest, response)

		return
	}

	type OrderIdData struct {
		OrderId int `json:"i"`
	}
	orderIdJSONData := &OrderIdData{}

	json.Unmarshal(orderIdData, orderIdJSONData)

	if orderIdJSONData.OrderId <= 0 {
		response.Success = false
		response.Error = "Invalid order id"

		c.JSON(http.StatusBadRequest, response)

		return
	}

	orderJSON, totalCost, err := oh.GetOrderByID(orderIdJSONData.OrderId)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		return
	}

	response.Data = gin.H{
		"order_id": orderIdJSONData.OrderId,
		"order":    orderJSON,
		"total":    totalCost,
	}
	response.Success = true
	c.JSON(http.StatusOK, response)
}

// OrderQRCode returns the QR code for a specific order.
func (oh *OrderHandlers) OrderQRCode(c *gin.Context) {
	orderId, err := getIDFromParams("orderId", c)

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	_, _, err = oh.GetOrderByID(orderId) // orderJSON, totalCost

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	encryptJSON := `{"i": ` + strconv.Itoa(orderId) + `}`
	encryptedId, _ := crypto.EncryptGCM([]byte(encryptJSON), []byte(oh.Config.Key))

	png, err := qrcode.Encode(string(encryptedId), qrcode.Medium, 256)

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Header("Content-Type", "image/png")
	c.Header("Content-Length", strconv.Itoa(len(png)))

	if _, err := c.Writer.Write(png); err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
}

// PrintReceipt handles requests for printing a receipt for a specific order.
func (oh *OrderHandlers) PrintReceipt(c *gin.Context) {
	response := &ApiResponse{}
	orderId, err := getIDFromParams("orderId", c)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	printerId, err := getIDFromParams("printerId", c)

	if err != nil {
		printerId = 1
	}

	orderJSON, totalCost, err := oh.GetOrderByID(orderId)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		return
	}

	// Create a new receipt.
	receipt := &Receipt{
		Order:     orderJSON,
		Total:     totalCost,
		Config:    oh.Config,
		printerId: printerId,
	}
	receipt.ConnectToPrinter()
	_, err = receipt.Print()

	response.Success = true
	response.Data = "OK"

	if err != nil {
		response.Error = err.Error()
	}

	c.JSON(http.StatusOK, response)
}

// OrderStream handles the streaming endpoint connections.
// const stream = new EventSource("/api/orders/stream");
// stream.addEventListener("message", (e) => {
//     console.log(e.data);
// });
func (oh *OrderHandlers) OrderStream(c *gin.Context) {
	streamUpdates := make(chan *OrderJSON)

	go func() {
		oh.Bus.Subscribe("order_updates", func(u *OrderJSON) {
			select {
			case streamUpdates <- u:
				return
			default:
				streamUpdates = make(chan *OrderJSON)
			}
		})
	}()

	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-streamUpdates; ok {
			c.SSEvent("message", msg)
			return true
		} else {
			fmt.Println("Something happened here")
			return false
		}
	})
}
