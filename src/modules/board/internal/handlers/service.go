package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
)

func Service(l *slog.Logger) http.HandlerFunc {
	type ServiceRequest struct {
		State   string `json:"state"`
		Module  string `json:"module"`
		PlaneID string `json:"plane_id"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		l.Info("Service handler called")

		req := ServiceRequest{}
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			l.Error("Failed to decode request", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: req.PlaneID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		// TODO: implement service logic

		if err := response.Json(w, response.Message{
			PlaneID: req.PlaneID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}

	}
}
