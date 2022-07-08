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
}

func (wrapper *Wrapper) LocationPost(c echo.Context) error {
	if err := wrapper.requireDeviceHeader(c); err != nil {
		return err
	}
	var entry newLocationEntry
	if err := utility.ValidateJsonForm(c, &entry); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request body")
	}
	if entry.TagID == 0 || entry.DeviceID == 0 {
		return c.String(http.StatusBadRequest, "Invalid or empty IDs")
	}
	account := models.LocationPing{TagID: entry.TagID, DeviceID: entry.DeviceID}
	wrapper.Database.Create(&account)
	return c.String(http.StatusOK, "Added new location post successfully")
}
