package server

import (
	"fmt"
	"html/template"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	mw "github.com/labstack/echo/v4/middleware"
	"github.com/myOmikron/echotools/execution"
	"github.com/myOmikron/echotools/middleware"
	"github.com/myOmikron/echotools/utilitymodels"
)

func Start(port int) {
	fmt.Printf("Do!!\n")

	db := InitDB()

	e := echo.New()
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseFS(os.DirFS("templates/"), "*.gohtml")),
	}
	e.Renderer = renderer
	e.Use(mw.LoggerWithConfig(mw.LoggerConfig{
		Format: "${time_rfc3339} :: ${status} ${method} ${uri} :: ${latency_human} ${error}\n",
	}))
	e.Use(mw.Recover())
	duration := time.Hour * 24
	e.Use(middleware.Session(db, &middleware.SessionConfig{
		CookieName: "session_id",
		CookieAge:  &duration,
	}))

	middleware.RegisterAuthProvider(utilitymodels.GetLocalUser(db))

	setupEndpoints(e, db)

	execution.SignalStart(e, fmt.Sprintf(":%d", port), &execution.Config{
		ReloadFunc:    func() {},
		StopFunc:      func() {},
		TerminateFunc: func() {},
	})
}