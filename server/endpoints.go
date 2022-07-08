package server

import (
	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/endpoints"
)

func setupEndpoints(e *echo.Echo) {
	e.GET("/", loginRequired(endpoints.Index))
	e.GET("/login", endpoints.LoginGet)
	e.POST("/login", endpoints.LoginPost)
	e.Static("/static", "static")
}
