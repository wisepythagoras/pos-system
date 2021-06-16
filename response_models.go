package main

import "time"

type ProductJSON struct {
	ID    uint64  `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Type  string  `json:"type"`
}

type OrderJSON struct {
	ID        uint64        `json:"id"`
	CreatedAt time.Time     `json:"created_at"`
	Products  []ProductJSON `json:"products"`
}
