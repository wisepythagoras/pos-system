package main

import (
	"net/http"

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
