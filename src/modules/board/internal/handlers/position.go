package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/model"
	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Position(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	type PositionDTO struct {
		X       int    `json:"x"`
		Y       int    `json:"y"`
		Z       int    `json:"z"`
		PlaneID string `json:"plane_id"`
	}

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Position handler called")

		planeCoords := PositionDTO{}
		err := json.NewDecoder(r.Body).Decode(&planeCoords)
		if err != nil {
			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				PlaneID: planeCoords.PlaneID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		// set the position of the plane with the given id
		err = s.SetCoords(planeCoords.PlaneID, &model.Position{
			X: planeCoords.X,
			Y: planeCoords.Y,
			Z: planeCoords.Z,
		})
		if err != nil {
			if errResp := response.JsonError(w, http.StatusInternalServerError, response.Message{
				PlaneID: planeCoords.PlaneID,
				Error:   err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, response.Message{
			PlaneID: planeCoords.PlaneID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Position handler called")

		planeID := r.URL.Query().Get("plane_id")

		// get the position of the coords with the given id
		coords, err := s.GetCoords(planeID)
		if err != nil {
			if errResp := response.JsonError(w, http.StatusInternalServerError, err); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, PositionDTO{
			X:       coords.X,
			Y:       coords.Y,
			Z:       coords.Z,
			PlaneID: planeID,
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
