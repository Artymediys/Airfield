package handlers

import (
	"fmt"
	"net/http"

	"golang.org/x/exp/slog"
)

func Transfer(l *slog.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		l.Info("Transfer handler called")

		// body: json { "plane_id": number , "operator": string }

		_, err := fmt.Fprintf(w, "OK")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})
}
