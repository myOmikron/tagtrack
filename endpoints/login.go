package endpoints

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/myOmikron/echotools/auth"
	"github.com/myOmikron/echotools/middleware"
)

type LoginRequest struct {
	Username string `form:"username"`
	Password string `form:"password"`
}

func (wrapper *Wrapper) LoginGet(c echo.Context) error {
	return c.Render(http.StatusOK, "login", nil)
}

func (wrapper *Wrapper) LoginPost(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "Not enough arguments")
	}

	user, err := auth.AuthenticateLocalUser(wrapper.Database, req.Username, req.Password)
	if err != nil {
		return c.String(http.StatusUnauthorized, "Invalid credentials")
	}

	if err := middleware.Login(wrapper.Database, user, c, true); err != nil {
		return c.String(http.StatusInternalServerError, "Login")
	}

	return c.Redirect(http.StatusFound, "/")
}

func (wrapper *Wrapper) Logout(c echo.Context) error {
	if err := middleware.Logout(wrapper.Database, c); err != nil {
		return c.String(http.StatusBadRequest, "Failed to logout")
	}
	return c.Redirect(http.StatusFound, "/")
}
