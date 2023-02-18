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

func Plane(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		type Req struct {
			PlaneType model.PlaneType `json:"plane_type"`
			Flight    string          `json:"flight"`
		}

		l.Info("Plane handler called")

		// body: json { "plane_type": string , "flight": string }
		req := Req{}
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

		p, err := model.CreatePlanByType(req.PlaneType, req.Flight)
		if err != nil {
			l.Error("Failed to create plane", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				Error: err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		err = s.SavePlane(p)
		if err != nil {
			l.Error("Failed to save plane", err)

			if errResp := response.JsonError(w, http.StatusInternalServerError, response.Message{
				Error: err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, response.Message{
			PlaneID: p.ID,
			Message: "OK",
		}); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Plane handler called")

		// Get query params with plane id
		planeID := r.URL.Query().Get("plane_id")
		if planeID == "" {
			l.Error("Plane id is empty", response.ErrNoPlaneID)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				Error: response.ErrNoPlaneID.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		plane, err := s.GetPlane(planeID)
		if err != nil {
			l.Error("Failed to get plane", err)

			if errResp := response.JsonError(w, http.StatusInternalServerError, response.Message{
				Error:   err.Error(),
				PlaneID: planeID,
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, plane); err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
