package customer

import (
	"html/template"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/myOmikron/echotools/database"
	"github.com/myOmikron/echotools/execution"
	mw "github.com/myOmikron/echotools/middleware"
	"github.com/myOmikron/echotools/utilitymodels"
	"gorm.io/driver/sqlite"
)

func StartServer() {
	e := echo.New()
	e.HideBanner = true

	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseFS(os.DirFS("templates/"), "*.gohtml")),
	}
	e.Renderer = renderer

	driver := sqlite.Open("customer.db")
	dbase := database.Initialize(
		driver,
	)

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${time_rfc3339} :: ${status} ${method} ${uri} :: ${latency_human} ${error}\n",
	}))
	e.Use(middleware.Recover())
	duration := time.Hour * 24
	e.Use(mw.Session(dbase, &mw.SessionConfig{
		CookieName: "sessionid",
		CookieAge:  &duration,
	}))

	mw.RegisterAuthProvider(utilitymodels.GetLocalUser(dbase))

	defineRoutes(e, dbase)

	execution.SignalStart(e, "127.0.0.1:8000", &execution.Config{
		ReloadFunc: func() {
			StartServer()
		},
		StopFunc: func() {

		},
		TerminateFunc: func() {

		},
	})
}
