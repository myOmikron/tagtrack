package server

import (
	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/middleware"
	"net/http"
)

func loginRequired(f func(c echo.Context) error) func(c echo.Context) error {
	return func(c echo.Context) error {
		sessionContext, err := middleware.GetSessionContext(c)
		if err != nil {
			c.Error(err)
			return c.Redirect(http.StatusFound, "/login")
		}

		if !sessionContext.IsAuthenticated() {
			return c.Redirect(http.StatusFound, "/login")
		}

		return f(c)
	}
}
