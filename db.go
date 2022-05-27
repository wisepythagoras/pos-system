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
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Station{})
	db.AutoMigrate(&StationProduct{})

	return db, nil
}
