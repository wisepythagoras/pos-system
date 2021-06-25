package main

import (
	"errors"
	"time"
)

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
	ID    uint64  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Type  string  `json:"type"`
}

// SetFromProductModel converts a product to a JSON formattable object.
func (pj *ProductJSON) SetFromProductModel(product *Product) error {
	if product == nil {
		return errors.New("Invalid product instance")
	}

	pj.ID = product.ID
	pj.Name = product.Name
	pj.Type = product.Type
	pj.Price = product.Price

	return nil
}

// OrderJSON describes the Order DB model, but in a JSON-ifiable format.
type OrderJSON struct {
	ID        uint64        `json:"id"`
	Cancelled bool          `json:"cancelled"`
	CreatedAt time.Time     `json:"created_at"`
	Products  []ProductJSON `json:"products"`
}
