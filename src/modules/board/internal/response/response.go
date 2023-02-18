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
	PlaneID string `json:"plane_id,omitempty"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

func Json(w http.ResponseWriter, code int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	return json.NewEncoder(w).Encode(data)
}

func JsonError(w http.ResponseWriter, code int, data any) error {
	return Json(w, code, data)
}
