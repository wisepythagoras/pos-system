package main

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;"`
	Name      string    `gorm:"uniqueIndex; index; type:mediumtext not null"`
	Price     float64   `gorm:"not null" json:"price"`
	Type      string    `gorm:"not null; default:'food'"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli"`
	UpdatedAt time.Time `gorm:"autoCreateTime:milli"`
}

type Order struct {
	gorm.Model
	ID            uint64         `gorm:"primaryKey; autoIncrement; not_null;"`
	CreatedAt     time.Time      `gorm:"autoCreateTime:milli"`
	OrderProducts []OrderProduct `gorm:"foreignKey:OrderID;references:ID;"`
}

type OrderProduct struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;"`
	ProductID uint64    `gorm:"index; not_null;"`
	OrderID   uint64    `gorm:"index; not_null;"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli"`
	Product   Product   `gorm:"foreignKey:ID;"`
}

// https://gorm.io/docs/has_one.html#Override-Foreign-Key
