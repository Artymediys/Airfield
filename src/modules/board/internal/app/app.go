package app

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/config"
)

const (
	defaultTimeout = 15 * time.Second
)

type App struct {
	cfg    *config.Config
	log    *slog.Logger
	srv    *http.Server
	router chi.Router
}

func New(c *config.Config, r chi.Router, l *slog.Logger) *App {
	return &App{
		cfg:    c,
		router: r,
		log:    l,
	}
}

func (a *App) Run() error {
	a.srv = &http.Server{
		Addr:         a.cfg.Addr(),
		Handler:      a.router,
		ReadTimeout:  defaultTimeout,
		WriteTimeout: defaultTimeout,
	}

	a.log.Info("Starting server",
		slog.Group("App",
			slog.String("host", a.cfg.Host),
			slog.String("port", a.cfg.Port),
		),
	)

	return a.srv.ListenAndServe()
}
