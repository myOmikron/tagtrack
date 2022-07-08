package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/middleware"
	"github.com/myOmikron/echotools/utilitymodels"
	"github.com/myOmikron/tagtrack/models"
)

func (wrapper *Wrapper) OrdersGet(c echo.Context) error {
	context, err := middleware.GetSessionContext(c)
	if err != nil {
		panic(42)
	}
	switch user := context.GetUser().(type) {
	case *utilitymodels.LocalUser:
		id := user.ID
		var accounts []models.AccountInfo
		wrapper.Database.Find(&accounts, "local_user_id = ?", id)
		if len(accounts) == 0 {
			return c.String(http.StatusBadRequest, "No valid account found")
		}
		if accounts[0].IsCustomer {
			return c.String(http.StatusBadRequest, "You are not permitted")
		}
	default:
		panic(42)
	}
	var orders []models.Order
	wrapper.Database.Preload("Tags").Preload("ProcessingSteps").Preload("ProcessingSteps.RequiredMachines").Find(&orders)
	return c.JSONPretty(http.StatusOK, orders, "  ")
}
