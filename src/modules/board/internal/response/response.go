package response

import (
	"encoding/json"
	"errors"
	"net/http"
)

var (
	ErrNoPlaneID = errors.New("no plane id provided")
)

type Message struct {
	PlaneID string `json:"plane_id"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

func Json(w http.ResponseWriter, data any) error {
	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(data)
}

func JsonError(w http.ResponseWriter, code int, data any) error {
	w.WriteHeader(code)
	return Json(w, data)
}
