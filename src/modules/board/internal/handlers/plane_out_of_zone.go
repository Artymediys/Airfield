package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
)

func PlaneOutOfZone(l *slog.Logger) http.HandlerFunc {
	type PlaneOutOfZoneRequest struct {
		PlaneID  string `json:"plane_id"`
		Operator string `json:"operator"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		l.Info("PlaneOutOfZone handler called")

		req := PlaneOutOfZoneRequest{}
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

		// TODO: implement plane out of zone logic

		if err := response.Json(w, response.Message{
			PlaneID: req.PlaneID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	}
}
