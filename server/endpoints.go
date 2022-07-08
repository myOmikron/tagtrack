package server

import (
	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/endpoints"
	"gorm.io/gorm"
)

func setupEndpoints(e *echo.Echo, db *gorm.DB) {
	wrapper := endpoints.Wrapper{
		Database: db,
	}
	e.GET("/", loginRequired(wrapper.Index))
	e.GET("/login", wrapper.LoginGet)
	e.GET("/logout", wrapper.Logout)
	e.POST("/login", wrapper.LoginPost)
	e.POST("/logout", wrapper.Logout)
	e.GET("/api/orders", loginRequired(wrapper.OrdersGet))
	e.POST("/api/locations", wrapper.LocationPost)
	e.Static("/static", "static")
}
