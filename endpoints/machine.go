package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/models"
)

func (wrapper *Wrapper) MachineLogsGet(c echo.Context) error {
	if err := wrapper.RequireManagement(c); err != nil {
		return err
	}
	var logs []models.MachineLog
	wrapper.Database.Find(&logs)
	return c.JSONPretty(http.StatusOK, logs, "  ")
}
