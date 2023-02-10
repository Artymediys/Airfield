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

	r.Get("/", handlers.Index(l))
	r.Mount("/plane", handlers.Plane(l))
	r.Mount("/position", handlers.Position(l))
	r.Mount("/height", handlers.Height(l))
	r.Mount("/passenger", handlers.Passenger(l))
	r.Post("/transfer", handlers.Transfer(l))
	r.Post("/plane_out_of_zone", handlers.PlaneOutOfZone(l))
	r.Post("/service", handlers.Service(l))

	return r
}
