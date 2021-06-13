package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func ConnectDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("pos.db"), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&Product{})
	db.AutoMigrate(&OrderProduct{})
	db.AutoMigrate(&Order{})

	// db.Preload("OrderProducts").Find(&Order{})
	// db.Preload("OrderProducts.Products").Find(&Order{})

	return db, nil
}
