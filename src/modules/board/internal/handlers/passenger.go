package handlers

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"
)

func Passenger(l *slog.Logger) http.Handler {
	r := chi.NewRouter()

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Passenger handler called")

		// set the position of the plane with the given id

		_, err := fmt.Fprintf(w, "OK")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Passenger handler called")

		_, err := fmt.Fprintf(w, `{"plane_id": 1, "passenger_ids": [1,2,3]"}`)
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}