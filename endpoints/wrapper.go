package endpoints

import (
	"errors"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/middleware"
	"github.com/myOmikron/echotools/utilitymodels"
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

func (wrapper *Wrapper) requireManagement(c echo.Context) error {
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
			_ = c.String(http.StatusBadRequest, "No valid account found")
			return errors.New("fail")
		}
		if accounts[0].IsCustomer {
			_ = c.String(http.StatusForbidden, "You are not permitted")
			return errors.New("fail")
		}
	default:
		panic(42)
	}
	return nil
}
