package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Speed(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	type SpeedDTO struct {
		PlaneID string `json:"plane_id"`
		Speed   uint   `json:"speed"`
	}

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Speed handler called")

		req := SpeedDTO{}
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			l.Error("Failed to decode request", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				Error: err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		// set the speed of the plane with the given id
		err = s.SetSpeed(req.PlaneID, req.Speed)
		if err != nil {
			l.Error("Failed to set speed", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
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

	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Speed handler called")

		planeID := r.URL.Query().Get("plane_id")
		if planeID == "" {
			l.Error("Plane ID is empty", response.ErrNoPlaneID)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				Error: response.ErrNoPlaneID.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		// get the speed of the plane with the given id
		speed, err := s.GetSpeed(planeID)
		if err != nil {
			l.Error("Failed to get speed", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: planeID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, SpeedDTO{
			PlaneID: planeID,
			Speed:   speed,
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
