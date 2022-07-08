package customer

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func defineRoutes(e *echo.Echo, db *gorm.DB) {
	e.GET("/", Index)

	e.Static("/static", "static/customer/")
}
