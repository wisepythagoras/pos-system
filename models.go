package main

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;" json:"id"`
	Name      string    `gorm:"uniqueIndex; index; type:mediumtext not null" json:"name"`
	Price     float64   `gorm:"not null" json:"price"`
	Type      string    `gorm:"not null; default:'food'" json:"type"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoCreateTime:milli" json:"updated_at"`
}

type Order struct {
	gorm.Model
	ID            uint64         `gorm:"primaryKey; autoIncrement; not_null;" json:"id"`
	CreatedAt     time.Time      `gorm:"autoCreateTime:milli" json:"created_at"`
	OrderProducts []OrderProduct `gorm:"foreignKey:OrderID; references:ID" json:"products"`
}

type OrderProduct struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;" json:"id"`
	ProductID uint64    `gorm:"index; not_null;" json:"product_id"`
	OrderID   uint64    `gorm:"index; not_null;" json:"order_id"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	Product   Product   `gorm:"foreignKey:ID; references:ProductID" json:"product"`
}
