package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StationHandlers struct {
	DB     *gorm.DB
	Config *Config
}

// CreateStation creates a new station.
func (sh *StationHandlers) CreateStation(c *gin.Context) {
	name := c.PostForm("name")

	apiResponse := ApiResponse{}

	if name == "" {
		apiResponse.Success = false
		apiResponse.Error = "Invalid inputs"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	sh.DB.Create(&Station{Name: name}).Commit()

	apiResponse.Success = true

	c.JSON(http.StatusOK, apiResponse)
}

func (sh *StationHandlers) AddProductToStation(c *gin.Context) {
	apiResponse := ApiResponse{}
	stationId, err := getIDFromParams("stationId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	productId, err := getIDFromParams("productId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	station := &Station{}
	product := &Product{}

	// We need to do some validation to make sure that both the station and
	// the product exist, so we don't add garbage to the database.
	sh.DB.First(station, "id = ?", stationId)
	sh.DB.First(product, "id = ?", productId)

	// Error out if either the station or the product didn't load.
	if station.ID == 0 || product.ID == 0 {
		apiResponse.Success = false
		apiResponse.Error = "Invalid station or product ID"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	// Finally, create the station product.
	sh.DB.Create(&StationProduct{
		StationID: uint64(stationId),
		ProductID: uint64(productId),
	}).Commit()

	apiResponse.Success = true

	c.JSON(http.StatusOK, apiResponse)
}
