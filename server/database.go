package server

import (
	"github.com/myOmikron/echotools/database"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func initDB() *gorm.DB {
	driver := sqlite.Open("sqlite.db")
	return database.Initialize(driver)
}
