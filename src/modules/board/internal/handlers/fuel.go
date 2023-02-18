package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Fuel(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	type FuelDTO struct {
		PlaneID string `json:"plane_id"`
		Fuel    uint   `json:"fuel"`
	}

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Fuel handler called")

		req := FuelDTO{}
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

		// set the fuel of the plane with the given id
		err = s.SetFuel(req.PlaneID, req.Fuel)
		if err != nil {
			l.Error("Failed to set fuel", err)

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
		l.Info("Fuel handler called")

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

		// get the fuel of the plane with the given id
		fuel, err := s.GetFuel(planeID)
		if err != nil {
			l.Error("Failed to get fuel", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: planeID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, FuelDTO{
			PlaneID: planeID,
			Fuel:    fuel,
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
