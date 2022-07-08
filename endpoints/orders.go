package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/models"
)

func (wrapper *Wrapper) OrdersGet(c echo.Context) error {
	var orders []models.Order
	wrapper.Database.Preload("Tags").Preload("ProcessingSteps").Preload("ProcessingSteps.RequiredMachines").Find(&orders)
	return c.JSONPretty(http.StatusOK, orders, "  ")
}
