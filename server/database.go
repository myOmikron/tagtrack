package server

import (
	"github.com/myOmikron/echotools/database"
	"github.com/myOmikron/tagtrack/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	driver := sqlite.Open("sqlite.db")
	return database.Initialize(
		driver,
		models.AccountInfo{},
		models.OrderState{},
		models.Order{},
		models.ProcessingStep{},
		models.Machine{},
		models.Tag{},
		models.Device{},
		models.LocationPing{},
		models.MachineLog{},
		models.MachineHistory{},
	)
}
