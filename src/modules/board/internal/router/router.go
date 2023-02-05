package router

import (
	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/handlers"
)

type Router struct {
	chi.Router
	logger *slog.Logger
}

func New(l *slog.Logger) chi.Router {
	r := &Router{
		logger: l,
		Router: chi.NewRouter(),
	}

	r.Mount("/", handlers.Index(l))
	r.Mount("/plane", handlers.Plane(l))

	return r
}
