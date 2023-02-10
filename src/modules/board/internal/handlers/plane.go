package handlers

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"
)

func Plane(l *slog.Logger) http.Handler {
	r := chi.NewRouter()

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Plane handler called")

		_, err := fmt.Fprintf(w, "Hello from create the plane handler!")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Plane handler called")

		_, err := fmt.Fprintf(w, "Hello from get the plane handler!")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}