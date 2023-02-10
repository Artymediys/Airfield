package handlers

import (
	"fmt"
	"net/http"

	"golang.org/x/exp/slog"
)

func Service(l *slog.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		l.Info("Service handler called")

		// body { state: start/finish, module: moduleName, plane_id: int }

		_, err := fmt.Fprintf(w, "OK")
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})
}
