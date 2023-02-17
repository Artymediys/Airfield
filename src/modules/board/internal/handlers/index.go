package handlers

import (
	"net/http"

	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
)

func Index(l *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l.Info("Index handler called")

		if err := response.Json(w, response.Message{
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	}
}
