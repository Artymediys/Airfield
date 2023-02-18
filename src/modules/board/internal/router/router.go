package router

import (
	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/handlers"
	"airfield-board/internal/store"
)

type Router struct {
	chi.Router
	logger     *slog.Logger
	planeStore *store.Plane
}

func New(l *slog.Logger, p *store.Plane) chi.Router {
	r := &Router{
		logger:     l,
		Router:     chi.NewRouter(),
		planeStore: p,
	}

	r.Get("/", handlers.Index(r.logger))
	r.Mount("/plane", handlers.Plane(r.logger, r.planeStore))
	r.Mount("/position", handlers.Position(r.logger, r.planeStore))
	r.Mount("/fuel", handlers.Fuel(r.logger, r.planeStore))
	r.Mount("/speed", handlers.Speed(r.logger, r.planeStore))
	r.Mount("/height", handlers.Height(r.logger, r.planeStore))
	r.Mount("/passenger", handlers.Passenger(r.logger, r.planeStore))
	r.Post("/transfer", handlers.Transfer(r.logger))
	r.Post("/plane_out_of_zone", handlers.PlaneOutOfZone(r.logger))
	r.Post("/service", handlers.Service(r.logger, r.planeStore))

	return r
}
