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

	station := &Station{Name: name}
	sh.DB.Create(station).Commit()

	apiResponse.Success = true

	if station.ID > 0 {
		apiResponse.Data = StationJSON{
			ID:        station.ID,
			Name:      station.Name,
			Products:  []ProductJSON{},
			CreatedAt: station.CreatedAt,
			UpdatedAt: station.UpdatedAt,
		}
	}

	c.JSON(http.StatusOK, apiResponse)
}

// AddProductToStation adds a product to a station.
func (sh *StationHandlers) AddProductToStation(c *gin.Context) {
	apiResponse := ApiResponse{}
	stationId, err := getIntFromParams("stationId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	productId, err := getIntFromParams("productId", c)

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

// RemoveProductFromStation removes a product from a station.
func (sh *StationHandlers) RemoveProductFromStation(c *gin.Context) {
	apiResponse := ApiResponse{}
	stationId, err := getIntFromParams("stationId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	productId, err := getIntFromParams("productId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	result := sh.DB.Exec(`
		delete from station_products
		where station_id = ? and product_id = ?
	`, stationId, productId)

	// Error out if either the station or the product didn't load.
	if result.RowsAffected == 0 {
		apiResponse.Success = false
		apiResponse.Error = "No such station product"
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	apiResponse.Success = true

	c.JSON(http.StatusOK, apiResponse)
}

func (sh *StationHandlers) constructProductsArray(station *Station) []ProductJSON {
	products := []ProductJSON{}

	for _, product := range station.StationProducts {
		productJSON := ProductJSON{
			ID:           product.Product.ID,
			Name:         product.Product.Name,
			Type:         product.Product.ProductType.Name,
			Price:        product.Product.Price,
			Discontinued: product.Product.Discontinued == 1,
			SoldOut:      product.Product.SoldOut == 1,
			ProductType: ProductTypeJSON{
				ID:    product.Product.ProductType.ID,
				Name:  product.Product.ProductType.Name,
				Title: product.Product.ProductType.Title,
			},
		}
		products = append(products, productJSON)
	}

	return products
}

// Station returns the station by its id.
func (sh *StationHandlers) Station(c *gin.Context) {
	apiResponse := ApiResponse{}
	stationId, err := getIntFromParams("stationId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	station := &Station{}
	sh.DB.
		Preload("StationProducts.Product").
		Preload("StationProducts.Product.ProductType").
		First(station, "id = ?", stationId)

	apiResponse.Success = true

	if station.ID > 0 {
		products := sh.constructProductsArray(station)

		apiResponse.Data = StationJSON{
			ID:        station.ID,
			Name:      station.Name,
			Products:  products,
			CreatedAt: station.CreatedAt,
			UpdatedAt: station.UpdatedAt,
		}
	}

	c.JSON(http.StatusOK, apiResponse)
}

// Stations returns a list of all stations.
func (sh *StationHandlers) Stations(c *gin.Context) {
	apiResponse := ApiResponse{}
	var stations []Station = []Station{}
	var stationsJson []StationJSON = []StationJSON{}

	sh.DB.
		Preload("StationProducts.Product").
		Preload("StationProducts.Product.ProductType").
		Order("id desc").
		Find(&stations)

	for _, station := range stations {
		products := sh.constructProductsArray(&station)

		newStation := StationJSON{
			ID:        station.ID,
			Name:      station.Name,
			Products:  products,
			CreatedAt: station.CreatedAt,
			UpdatedAt: station.UpdatedAt,
		}
		stationsJson = append(stationsJson, newStation)
	}

	apiResponse.Success = true
	apiResponse.Data = stationsJson

	c.JSON(http.StatusOK, apiResponse)
}

// Delete removes a station by its id.
func (sh *StationHandlers) Delete(c *gin.Context) {
	apiResponse := ApiResponse{}
	stationId, err := getIntFromParams("stationId", c)

	if err != nil {
		apiResponse.Success = false
		apiResponse.Error = err.Error()
		c.JSON(http.StatusOK, apiResponse)
		return
	}

	sh.DB.Exec("delete from station_products where station_id = ?", stationId)
	result := sh.DB.Exec("delete from stations where id = ?", stationId)

	apiResponse.Success = false
	apiResponse.Error = result.Commit().Error.Error()

	if result.RowsAffected > 0 {
		apiResponse.Success = true
	}

	c.JSON(http.StatusOK, apiResponse)
}
