package handlers

import (
	"encoding/json"
	"net/http"

	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Service(l *slog.Logger, s *store.Plane) http.HandlerFunc {
	type ServiceRequest struct {
		State   string `json:"state"`
		Module  string `json:"module"`
		PlaneID string `json:"plane_id"`
		Count   uint   `json:"count"`
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

		_, err = s.DoByModule(req.Module, req.State, req.PlaneID, req.Count)
		if err != nil {
			l.Error("Failed to do service", err)

			if errResp := response.JsonError(w, http.StatusInternalServerError, response.Message{
				PlaneID: req.PlaneID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, response.Message{
			PlaneID: req.PlaneID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}

	}
}
