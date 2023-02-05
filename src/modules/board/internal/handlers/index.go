package handlers

import (
	"fmt"
	"net/http"

	"golang.org/x/exp/slog"
)

func Index(l *slog.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		l.Info("Index handler called")

		_, err := fmt.Fprintf(w, "Hello from the index handler!")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})
}
