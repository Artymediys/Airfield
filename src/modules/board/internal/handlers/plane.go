package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"golang.org/x/exp/slog"

	"airfield-board/internal/model"
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
			w.WriteHeader(http.StatusBadRequest)
			_, errW := fmt.Fprintf(w, "Failed to decode request body")
			if errW != nil {
				l.Error("Failed to write response", errW)
			}
			return
		}

		p, err := model.CreatePlanByType(req.PlaneType, req.Flight)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_, errW := fmt.Fprintf(w, "Failed to create plane: %v", err)
			if errW != nil {
				l.Error("Failed to write response", errW)
			}
			return
		}

		err = s.SavePlane(p)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_, errW := fmt.Fprintf(w, "Failed to save plane")
			if errW != nil {
				l.Error("Failed to write response", errW)
			}
			return
		}

		_, err = fmt.Fprintf(w, "Plane created: %s", p.ID)
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		l.Info("Plane handler called")

		// Get query params with plane id
		planeID := r.URL.Query().Get("plane_id")
		if planeID == "" {
			w.WriteHeader(http.StatusBadRequest)
			_, err := fmt.Fprintf(w, "plane_id parameter is required")
			if err != nil {
				l.Error("Failed to write response", err)
			}
			return
		}

		plane, err := s.GetPlane(planeID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_, errW := fmt.Fprintf(w, "Failed to get plane")
			if errW != nil {
				l.Error("Failed to write response", errW)
			}
			return
		}

		_, err = fmt.Fprintf(w, "Hello from get the plane handler! Plane: %v", plane)
		if err != nil {
			l.Error("Failed to write response", err)
		}
	})

	return r
}
