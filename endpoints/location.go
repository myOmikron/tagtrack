package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/utility"
	"github.com/myOmikron/tagtrack/models"
)

type newLocationEntry struct {
	DeviceID uint `json:"deviceID"`
	TagID    uint `json:"tagID"`
	Power    int  `json:"power"` // closer to zero means stronger (always negative)
}

func (wrapper *Wrapper) LocationGet(c echo.Context) error {
	if err := wrapper.requireManagement(c); err != nil {
		return err
	}
	var locationPings []models.LocationPing
	wrapper.Database.Find(&locationPings)
	return c.JSONPretty(http.StatusOK, locationPings, "  ")
}

func (wrapper *Wrapper) LocationPost(c echo.Context) error {
	if err := wrapper.requireDeviceHeader(c); err != nil {
		return err
	}
	var entry newLocationEntry
	if err := utility.ValidateJsonForm(c, &entry); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request body")
	}
	if entry.TagID == 0 || entry.DeviceID == 0 || entry.Power == 0 {
		return c.String(http.StatusBadRequest, "Invalid or empty IDs or power values")
	}
	account := models.LocationPing{TagID: entry.TagID, DeviceID: entry.DeviceID}
	wrapper.Database.Create(&account)
	return c.String(http.StatusOK, "Added new location post successfully")
}
