package server

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type BadRequest struct {
	Message string `json:"message"`
}

type LoginRequest struct {
	Username string `form:"username"`
	Password string `form:"password"`
}

type Login struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
}

func setupEndpoints(e *echo.Echo) {
	e.GET("/", loginRequired(index))
	e.GET("/login", loginGet)
	e.POST("/login", loginPost)
	e.Static("/static", "../static")
}

func index(c echo.Context) error {
	return c.Render(http.StatusOK, "index", nil)
}

func loginGet(c echo.Context) error {
	return c.Render(http.StatusOK, "login", nil)
}

func loginPost(c echo.Context) error {
	log.Println("Test")
	var u LoginRequest
	if err := c.Bind(&u); err != nil {
		return c.String(http.StatusBadRequest, "not enough arguments")
	}

	// TODO: Do login & redirect to /
	return c.JSONPretty(http.StatusOK, Login{
		Success: true,
		Token:   "",
	}, "  ")
}
