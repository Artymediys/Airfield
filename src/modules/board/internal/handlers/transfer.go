package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
)

func Transfer(l *slog.Logger) http.HandlerFunc {
	type TransferRequest struct {
		PlaneID  string `json:"plane_id"`
		Operator string `json:"operator"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		l.Info("Transfer handler called")

		req := TransferRequest{}
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			l.Error("Failed to decode request", err)

			errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: req.PlaneID,
				Error:   err.Error(),
			})
			if errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		// TODO: implement transfer logic

		if err := response.Json(w, http.StatusOK, response.Message{
			PlaneID: req.PlaneID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	}
}
