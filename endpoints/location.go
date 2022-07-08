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
	var entry newLocationEntry
	if err := utility.ValidateJsonForm(c, &entry); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request body")
	}
	account := models.LocationPing{TagID: entry.TagID, DeviceID: entry.DeviceID}
	wrapper.Database.Create(&account)
	return c.String(http.StatusOK, "Added new location post successfully")
}
