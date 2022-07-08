package endpoints

import (
	"log"
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
	log.Println("Test")
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "not enough arguments")
	}

	// TODO: Do login

	user, err := auth.AuthenticateLocalUser(wrapper.Database, req.Username, req.Password)
	if err != nil {
		return c.String(http.StatusUnauthorized, "Invalid credentials")
	}

	if err := middleware.Login(wrapper.Database, user, c, true); err != nil {
		return c.String(http.StatusInternalServerError, "put put :(") // TODO: database put put ?
	}

	return c.Redirect(http.StatusFound, "/")
}
