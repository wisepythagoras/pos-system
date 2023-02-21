package main

import (
	"errors"
	"time"
)

type ProductTypeJSON struct {
	ID    uint64 `json:"id"`
	Name  string `json:"name"`
	Title string `json:"title"`
}

// ProductsToJSONFormat converts an array of product models to a JSON-ifiable
// format.
func ProductsToJSONFormat(products []Product) *[]ProductJSON {
	var consumable []ProductJSON

	for _, product := range products {
		productJSON := &ProductJSON{}
		productJSON.SetFromProductModel(&product)

		consumable = append(consumable, *productJSON)
	}

	return &consumable
}

// ProductJSON describes the Product DB model, but in a JSON-ifiable format.
type ProductJSON struct {
	ID           uint64          `json:"id"`
	Name         string          `json:"name"`
	Price        float64         `json:"price"`
	Type         string          `json:"type"`
	Discontinued bool            `json:"discontinued"`
	SoldOut      bool            `json:"sold_out"`
	ProductType  ProductTypeJSON `json:"product_type"`
}

// SetFromProductModel converts a product to a JSON formattable object.
func (pj *ProductJSON) SetFromProductModel(product *Product) error {
	if product == nil {
		return errors.New("invalid product instance")
	}

	pj.ID = product.ID
	pj.Name = product.Name
	pj.Type = product.ProductType.Name
	pj.Price = product.Price
	pj.Discontinued = product.Discontinued == 1
	pj.SoldOut = product.SoldOut == 1
	pj.ProductType = ProductTypeJSON{
		ID:    product.ProductType.ID,
		Name:  product.ProductType.Name,
		Title: product.ProductType.Title,
	}

	return nil
}

// OrderProductJSON describes the Product DB model alongwith the field that indicates
// if it has been fulfilled, but in a JSON-ifiable format.
type OrderProductJSON struct {
	ID           uint64          `json:"id"`
	Name         string          `json:"name"`
	Price        float64         `json:"price"`
	Type         string          `json:"type"`
	Discontinued bool            `json:"discontinued"`
	SoldOut      bool            `json:"sold_out"`
	Fulfilled    bool            `json:"fulfilled"` // This is an OrderProduct level field.
	ProductType  ProductTypeJSON `json:"product_type"`
}

type AggregateProduct struct {
	ID       uint64  `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Type     string  `json:"type"`
	Quantity uint    `json:"quantity"`
}

// OrderJSON describes the Order DB model, but in a JSON-ifiable format.
type OrderJSON struct {
	ID        uint64             `json:"id"`
	Cancelled bool               `json:"cancelled"`
	CreatedAt time.Time          `json:"created_at"`
	Products  []OrderProductJSON `json:"products"`
}

type StationJSON struct {
	ID        uint64        `json:"id"`
	Name      string        `json:"name"`
	CreatedAt time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
	Products  []ProductJSON `json:"products"`
}

type UserJSON struct {
	ID        uint64       `json:"id"`
	Username  string       `json:"username"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
	StationID uint64       `json:"station_id"`
	Station   *StationJSON `json:"station"`
}
