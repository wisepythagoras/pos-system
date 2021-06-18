package main

import (
	"net/http"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	db, err := ConnectDB()

	if err != nil {
		panic(err)
	}

	productHandlers := &ProductHandlers{DB: db}
	orderHandlers := &OrderHandlers{DB: db}

	router := gin.Default()
	router.LoadHTMLGlob("templates/*")

	router.Use(static.Serve("/", static.LocalFile("./public", false)))

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Main website",
		})
	})

	router.POST("/api/order/submit", orderHandlers.CreateOrder)
	router.GET("/api/order/:orderId", orderHandlers.PrintOrder)

	router.POST("/api/product", productHandlers.CreateProduct)
	router.GET("/api/products", productHandlers.ListProducts)

	router.Run(":8088")
}
