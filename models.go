package main

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID           uint64    `gorm:"primaryKey; autoIncrement; not_null;"`
	Name         string    `gorm:"uniqueIndex; index; type:mediumtext not null"`
	Price        float64   `gorm:"not_null;"`
	Type         string    `gorm:"not_null; default:'food'"`
	Discontinued uint8     `gorm:"not_null; default:0"`
	SoldOut      uint8     `gorm:"not_null; default:0"`
	CreatedAt    time.Time `gorm:"autoCreateTime:milli"`
	UpdatedAt    time.Time `gorm:"autoCreateTime:milli"`
}

type Order struct {
	gorm.Model
	ID            uint64         `gorm:"primaryKey; autoIncrement; not_null;"`
	Cancelled     uint8          `gorm:"not_null; default 0"`
	CreatedAt     time.Time      `gorm:"autoCreateTime:milli"`
	OrderProducts []OrderProduct `gorm:"foreignKey:OrderID;references:ID;"`
	Products      []Product      `gorm:"-"`
}

type OrderProduct struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;"`
	ProductID uint64    `gorm:"not_null;"` // index;
	OrderID   uint64    `gorm:"not_null;"` // index;
	CreatedAt time.Time `gorm:"autoCreateTime:milli"`
	Product   Product
}

type User struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;"`
	Username  string    `gorm:"uniqueIndex; index; not_null;"`
	Password  string    `gorm:"not_null;"`
	Role      uint8     `gorm:"not_null; default 0"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli"`
	UpdatedAt time.Time `gorm:"autoCreateTime:milli"`
}

type Station struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;" json:"id"`
	Name      string    `gorm:"uniqueIndex; index; not_null;" json:"name"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoCreateTime:milli" json:"updated_at"`
}

type StationProduct struct {
	gorm.Model
	ID        uint64    `gorm:"primaryKey; autoIncrement; not_null;" json:"id"`
	StationID uint64    `gorm:"index; not_null;" json:"station_id"`
	ProductID uint64    `gorm:"index; not_null;" json:"product_id"`
	CreatedAt time.Time `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoCreateTime:milli" json:"updated_at"`
}

// https://gorm.io/docs/has_one.html#Override-Foreign-Key

const (
	RoleSales   uint8 = 0
	RoleStation uint8 = 1
)
