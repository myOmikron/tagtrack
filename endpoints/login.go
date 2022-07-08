package endpoints

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type LoginRequest struct {
	Username string `form:"username"`
	Password string `form:"password"`
}

func LoginGet(c echo.Context) error {
	return c.Render(http.StatusOK, "login", nil)
}

func LoginPost(c echo.Context) error {
	log.Println("Test")
	var u LoginRequest
	if err := c.Bind(&u); err != nil {
		return c.String(http.StatusBadRequest, "not enough arguments")
	}

	// TODO: Do login

	return c.Redirect(http.StatusFound, "/")
}
