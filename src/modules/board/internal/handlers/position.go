package handlers

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"
)

func Position(l *slog.Logger) http.Handler {
	r := chi.NewRouter()

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Position handler called")

		// set the position of the plane with the given id

		_, err := fmt.Fprintf(w, "OK")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Position handler called")

		_, err := fmt.Fprintf(w, `{"x": 1, "y": 1, "z": 1, "plane_id": 1}`)
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
