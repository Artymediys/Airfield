package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Passenger(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	type PassengerDTO struct {
		PlaneID      string   `json:"plane_id"`
		PassengerIDs []string `json:"passenger_ids"`
	}

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Passenger handler called")

		req := PassengerDTO{}
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

		// set passengers for the plane with the given id
		err = s.SetPassengers(req.PlaneID, req.PassengerIDs)
		if err != nil {
			l.Error("Failed to set passengers", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: req.PlaneID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, response.Message{
			PlaneID: req.PlaneID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Passenger handler called")

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

		// get passengers for the plane with the given id
		passengers, err := s.GetPassengers(planeID)
		if err != nil {
			l.Error("Failed to get passengers", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: planeID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, PassengerDTO{
			PlaneID:      planeID,
			PassengerIDs: passengers,
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
