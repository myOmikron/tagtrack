package server

import (
	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/endpoints"
	"gorm.io/gorm"
)

func enforceManagement(wrapper *endpoints.Wrapper) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if err := wrapper.RequireManagement(c); err != nil {
				return err
			}
			return next(c)
		}
	}
}

func setupEndpoints(e *echo.Echo, db *gorm.DB) {
	wrapper := endpoints.Wrapper{
		Database: db,
	}
	managementGroup := e.Group("/management", enforceManagement(&wrapper))
	managementGroup.Static("/", "management")

	e.GET("/", loginRequired(wrapper.Index))
	e.GET("/login", wrapper.LoginGet)
	e.GET("/logout", wrapper.Logout)
	e.POST("/login", wrapper.LoginPost)
	e.POST("/logout", wrapper.Logout)
	e.GET("/api/orders", loginRequired(wrapper.OrdersGet))
	e.GET("/api/machineHistory", loginRequired(wrapper.MachineHistoryGet))
	e.GET("/api/machineLogs", loginRequired(wrapper.MachineLogsGet))
	e.GET("/api/locations", loginRequired(wrapper.LocationGet))
	e.POST("/api/locations", wrapper.LocationPost)
	e.Static("/static", "static")
}
