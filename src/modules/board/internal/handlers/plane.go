package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/model"
	"airfield-board/internal/response"
	"airfield-board/internal/store"
)

func Plane(l *slog.Logger, s *store.Plane) http.Handler {
	r := chi.NewRouter()

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		type CreateReq struct {
			NumOfPeople int `json:"num_of_people"`
			FlightID    int `json:"flight_id"`
			Time        int `json:"time"` // через сколько секунд должен вылететь
		}

		l.Info("Plane handler called")

		req := CreateReq{}
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

		p, err := model.CreatePlanByType(model.PlaneTypeCargo, strconv.Itoa(req.FlightID))
		if err != nil {
			l.Error("Failed to create plane", err)

			if errResp := response.JsonError(w, http.StatusBadRequest, response.Message{
				Error: err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		err = s.SavePlane(nil, p)
		if err != nil {
			l.Error("Failed to save plane", err)

			if errResp := response.JsonError(w, http.StatusInternalServerError, response.Message{
				Error: err.Error(),
			}); errResp != nil {
				l.Error("Failed to write response", errResp)
			}

			return
		}

		if err := response.Json(w, http.StatusOK, map[string]any{
			"created":   true,
			"flight_id": req.FlightID,
			"plane_id":  p.ID,
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
