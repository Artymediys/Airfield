package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Height(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	type HeightDTO struct {
		PlaneID string `json:"plane_id"`
		Height  uint   `json:"height"`
	}

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Height handler called")

		req := HeightDTO{}
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

		// set the position of the plane with the given id
		err = s.SetHeight(req.PlaneID, req.Height)
		if err != nil {
			l.Error("Failed to set height", err)

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
		l.Info("Height handler called")

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

		// get the height of the plane with the given id
		height, err := s.GetHeight(planeID)
		if err != nil {
			l.Error("Failed to get height", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: planeID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, HeightDTO{
			PlaneID: planeID,
			Height:  height,
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
