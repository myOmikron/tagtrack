package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/middleware"
	"github.com/myOmikron/echotools/utilitymodels"
	"github.com/myOmikron/tagtrack/models"
)

func (wrapper *Wrapper) Index(c echo.Context) error {
	var orders []models.Order
	context, err := middleware.GetSessionContext(c)
	if err != nil {
		panic(42)
	}
	user := context.GetUser()
	var id uint
	switch x := user.(type) {
	case *utilitymodels.LocalUser:
		id = x.ID
	default:
		panic(42)
	}

	var accounts []models.AccountInfo
	wrapper.Database.Find(&accounts, "local_user_id = ?", id)
	if len(accounts) != 1 {
		return c.String(http.StatusBadRequest, "Invalid account information")
	}
	if accounts[0].IsCustomer {
		wrapper.Database.Preload("OrderState").Preload("ProcessingSteps").Find(&orders, "customer_id = ? ORDER BY created_at", id)
		return c.Render(http.StatusOK, "index", struct {
			Orders []models.Order
		}{Orders: orders})
	} else {
		return c.Redirect(http.StatusFound, "/management/")
	}
}
