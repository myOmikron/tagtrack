package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (wrapper *Wrapper) Index(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}