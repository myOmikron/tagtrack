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
	e.POST("/login", wrapper.LoginPost)
	e.Static("/static", "static")
}
