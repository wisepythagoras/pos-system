package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/asaskevich/EventBus"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type wsMessage struct {
	ID          uint64
	Product     ProductJSON
	MessageDate time.Time
}

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// ProductFormatter formats a product object.
func ProductFormatter(product *Product) interface{} {
	if product == nil {
		return nil
	}

	return gin.H{
		"id":           product.ID,
		"name":         product.Name,
		"price":        product.Price,
		"type":         product.ProductType.Name,
		"created_at":   product.CreatedAt,
		"discontinued": product.Discontinued == 1,
		"sold_out":     product.SoldOut == 1,
		"product_type": gin.H{
			"id":    product.ProductType.ID,
			"name":  product.ProductType.Name,
			"title": product.ProductType.Title,
		},
	}
}

// ProductHandlers defines the handlers for all of the products.
type ProductHandlers struct {
	DB        *gorm.DB
	wsUpdates []wsMessage
	wsClients map[string]*websocket.Conn
	Bus       EventBus.Bus
}

// CreateProduct creates a product.
func (ph *ProductHandlers) CreateProduct(c *gin.Context) {
	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	productTypeStr := c.PostForm("type")

	apiResponse := ApiResponse{}

	if name == "" || priceStr == "" || productTypeStr == "" {
		apiResponse.Success = false
		apiResponse.Error = "Invalid inputs"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	productTypeID, err := strconv.Atoi(productTypeStr)
	var productType ProductType

	if err == nil {
		ph.DB.Where("id = ?", productTypeID).Find(&productType)
	}

	if err != nil || productType.ID == 0 {
		apiResponse.Success = false
		apiResponse.Error = "Invalid product type"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	ph.DB.Create(&Product{
		Name:          name,
		Price:         price,
		ProductTypeID: productType.ID,
	}).Commit()

	apiResponse.Success = true

	c.JSON(http.StatusOK, apiResponse)
}

// ListProducts returns a complete list of products.
func (ph *ProductHandlers) ListProducts(c *gin.Context) {
	var productObjs []*Product
	var products []any = []any{}

	// The GET param that tells us to get all products or not.
	allProducts := c.Query("all") != ""

	if allProducts {
		ph.DB.
			Preload("ProductType").
			Order("product_type_id asc").
			Order("name asc").
			Find(&productObjs)
	} else {
		ph.DB.Where("discontinued = 0").
			Preload("ProductType").
			Order("product_type_id asc").
			Order("name asc").
			Find(&productObjs)
	}

	for _, product := range productObjs {
		products = append(products, ProductFormatter(product))
	}

	apiResponse := ApiResponse{
		Data:    products,
		Success: true,
	}

	c.JSON(http.StatusOK, apiResponse)
}

// UpdateProduct updates the fields of a product.
func (ph *ProductHandlers) UpdateProduct(c *gin.Context) {
	response := &ApiResponse{}
	productId, err := getIntFromParams("productId", c)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	name := c.PostForm("name")
	priceStr := c.PostForm("price")
	productTypeStr := c.PostForm("product_type_id")
	soldOutStr := c.PostForm("sold_out")

	// Convert the price string to a float.
	price, err := strconv.ParseFloat(priceStr, 64)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	productTypeID, err := strconv.Atoi(productTypeStr)
	var productType ProductType

	if err == nil {
		ph.DB.Where("id = ?", productTypeID).Find(&productType)
	}

	if err != nil || productType.ID == 0 {
		response.Success = false
		response.Error = "Invalid product type"
		c.JSON(http.StatusOK, response)
		return
	}

	product := Product{ID: uint64(productId)}
	ph.DB.First(&product)

	if len(product.Name) == 0 {
		response.Success = false
		response.Error = "No such product"
		c.JSON(http.StatusOK, response)
		return
	}

	var soldOut uint8 = 0

	if soldOutStr == "true" {
		soldOut = 1
	}

	// Update our fields field.
	product.Name = name
	product.Price = price
	product.SoldOut = soldOut
	product.ProductTypeID = productType.ID

	// Finally save.
	ph.DB.Save(&product)

	product.ProductType = productType

	// This is so that users get updates over the socket.
	productJSON := ProductJSON{}
	productJSON.SetFromProductModel(&product)

	update := wsMessage{
		ID:          product.ID,
		Product:     productJSON,
		MessageDate: time.Now(),
	}

	ph.wsUpdates = append(ph.wsUpdates, update)
	ph.Bus.Publish("product_updates", update)

	response.Success = true
	c.JSON(http.StatusOK, response)
}

// ToggleDiscontinued turns the discontinued field of a product on and off.
func (ph *ProductHandlers) ToggleDiscontinued(c *gin.Context) {
	response := &ApiResponse{}
	productId, err := getIntFromParams("productId", c)

	if err != nil {
		response.Success = false
		response.Error = err.Error()
		c.JSON(http.StatusOK, response)
		return
	}

	product := Product{ID: uint64(productId)}
	ph.DB.Preload("ProductType").First(&product)

	if len(product.Name) == 0 {
		response.Success = false
		response.Error = "No such product"
		c.JSON(http.StatusOK, response)
		return
	}

	// Toggle this field.
	product.Discontinued = (product.Discontinued + 1) % 2

	// Finally save.
	ph.DB.Save(&product)

	// This is so that users get updates over the socket.
	productJSON := ProductJSON{}
	productJSON.SetFromProductModel(&product)

	update := wsMessage{
		ID:          product.ID,
		Product:     productJSON,
		MessageDate: time.Now(),
	}

	ph.wsUpdates = append(ph.wsUpdates, update)
	ph.Bus.Publish("product_updates", update)

	response.Success = true
	c.JSON(http.StatusOK, response)
}

// StartWSHandler starts the websocket client handler.
func (ph *ProductHandlers) StartWSHandler() {
	ph.wsClients = make(map[string]*websocket.Conn)

	// TODO: Maybe all this should be deleted and the app should rely on the event bus, instead
	// of this code that I put together (which is probably error-prone).

	go func() {
		for {
			updates := ph.wsUpdates
			ph.wsUpdates = make([]wsMessage, 0)

			for _, v := range updates {
				if time.Now().Unix()-v.MessageDate.Unix() > 2000 {
					continue
				}

				bin, _ := json.Marshal(v.Product)

				for _, conn := range ph.wsClients {
					err := conn.WriteMessage(websocket.BinaryMessage, bin)

					if err != nil {
						fmt.Println(err)
					}
				}
			}

			time.Sleep(time.Second)
		}
	}()
}

// ProductUpdateWS handles web socket connections.
func (ph *ProductHandlers) ProductUpdateWS(c *gin.Context) {
	conn, err := wsUpgrader.Upgrade(c.Writer, c.Request, nil)
	ph.wsClients[conn.RemoteAddr().String()] = conn

	if err != nil {
		return
	}

	conn.SetCloseHandler(func(code int, text string) error {
		conn.WriteMessage(websocket.CloseMessage, []byte{})

		delete(ph.wsClients, conn.RemoteAddr().String())

		return nil
	})
}

// ProductUpdateStream handles the streaming endpoint connections.
// const stream = new EventSource("/api/products/stream");
//
//	stream.addEventListener("message", (e) => {
//	    console.log(e.data);
//	});
func (ph *ProductHandlers) ProductUpdateStream(c *gin.Context) {
	streamUpdates := make(chan wsMessage)
	// defer close(streamUpdates)

	go func() {
		ph.Bus.Subscribe("product_updates", func(u wsMessage) {
			select {
			case streamUpdates <- u:
				return
			default:
				streamUpdates = make(chan wsMessage)
			}
		})
	}()

	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-streamUpdates; ok {
			c.SSEvent("message", msg.Product)
			return true
		} else {
			fmt.Println("Something happened here")
			return false
		}
	})
}

func (ph *ProductHandlers) ListProductTypes(c *gin.Context) {
	apiResponse := new(ApiResponse)
	returnableProductTypes := []any{}
	var productTypes []*ProductType

	ph.DB.Order("title asc").
		Order("name asc").
		Find(&productTypes)

	for _, pt := range productTypes {
		ptj := gin.H{
			"id":    pt.ID,
			"name":  pt.Name,
			"title": pt.Title,
		}
		returnableProductTypes = append(returnableProductTypes, ptj)
	}

	apiResponse.Success = true
	apiResponse.Data = returnableProductTypes

	c.JSON(http.StatusOK, apiResponse)
}

func (ph *ProductHandlers) CreateProductType(c *gin.Context) {
	apiResponse := new(ApiResponse)
	name := c.PostForm("name")
	title := c.PostForm("title")

	if len(name) == 0 || len(title) == 0 {
		apiResponse.Success = false
		apiResponse.Error = "No name or title"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	newProductType := &ProductType{Name: name, Title: title}
	result := ph.DB.Save(newProductType).Commit()

	if result.RowsAffected == 0 {
		apiResponse.Success = false
		apiResponse.Error = "The new product type was not saved"
	} else {
		apiResponse.Success = true
	}

	c.JSON(http.StatusOK, apiResponse)
}
