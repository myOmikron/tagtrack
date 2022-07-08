package customer

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func Login(c echo.Context) error {
	return c.Render(http.StatusOK, "login", nil)
}

func Index(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}
