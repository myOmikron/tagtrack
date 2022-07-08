package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/models"
	"gorm.io/gorm/clause"
)

func (wrapper *Wrapper) MachineLogsGet(c echo.Context) error {
	if err := wrapper.RequireManagement(c); err != nil {
		return err
	}
	var logs []models.MachineLog
	wrapper.Database.Find(&logs)
	return c.JSONPretty(http.StatusOK, logs, "  ")
}

func (wrapper *Wrapper) MachineHistoryGet(c echo.Context) error {
	if err := wrapper.RequireManagement(c); err != nil {
		return err
	}
	var machines []models.Machine
	wrapper.Database.Find(&machines)
	logs := make(map[int][]float64, len(machines))
	for i := 0; i < len(machines); i++ {
		var history []models.MachineHistory
		wrapper.Database.Order(
			clause.OrderByColumn{Column: clause.Column{Name: "id"}, Desc: true}).
			Limit(24*7+1).
			Find(&history, "machine_id = ?", machines[i].ID)
		logs[i] = make([]float64, len(history))
		for j, h := range history {
			logs[i][j] = h.Usage
		}
	}
	return c.JSONPretty(http.StatusOK, logs, "  ")
}
