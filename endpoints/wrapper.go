package endpoints

import (
	"errors"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/tagtrack/models"
	"gorm.io/gorm"
)

type Wrapper struct {
	Database *gorm.DB
}

func (wrapper *Wrapper) requireDeviceHeader(c echo.Context) error {
	authorization := c.Request().Header.Get("Authorization")
	if authorization == "" {
		_ = c.String(http.StatusUnauthorized, "No Authorization header found")
		return errors.New("fail")
	}
	authType, value, found := strings.Cut(authorization, " ")
	if !found || strings.ToLower(authType) != "bearer" {
		_ = c.String(http.StatusUnauthorized, "")
		return errors.New("fail")
	}
	var devices []models.Device
	wrapper.Database.Find(&devices, "pre_shared_secret = ?", value)
	if len(devices) != 1 {
		_ = c.String(http.StatusUnauthorized, "Invalid authorization header")
		return errors.New("fail")
	}
	return nil
}
