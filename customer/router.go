package customer

import (
	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/middleware"
	"gorm.io/gorm"
	"net/http"
)

func loginRequired(f func(c echo.Context) error) func(c echo.Context) error {
	return func(c echo.Context) error {
		sessionContext, err := middleware.GetSessionContext(c)
		if err != nil {
			return c.Redirect(http.StatusFound, "/login")
		}

		if !sessionContext.IsAuthenticated() {
			return c.Redirect(http.StatusFound, "/login")
		}

		return f(c)
	}
}

func defineRoutes(e *echo.Echo, db *gorm.DB) {
	e.GET("/", loginRequired(Index))

	e.GET("/login", Login)

	e.Static("/static", "static/customer/")
}
