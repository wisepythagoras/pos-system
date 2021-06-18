package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func parseConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	var config Config

	if err := viper.ReadInConfig(); err != nil {
		fmt.Printf("Error reading config file, %s", err)
	}

	viper.SetDefault("server.port", 8088)

	err := viper.Unmarshal(&config)

	if err != nil {
		return nil, err
	}

	return &config, nil
}

func main() {
	db, err := ConnectDB()

	if err != nil {
		panic(err)
	}

	config, err := parseConfig()

	if err != nil {
		fmt.Println(err.Error())
		return
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

	router.GET("/admin", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Admin",
		})
	})

	router.POST("/api/order", orderHandlers.CreateOrder)
	router.GET("/api/order/:orderId", orderHandlers.PrintOrder)

	router.POST("/api/product", productHandlers.CreateProduct)
	router.GET("/api/products", productHandlers.ListProducts)

	router.Run(":" + strconv.Itoa(config.Server.Port))
}
