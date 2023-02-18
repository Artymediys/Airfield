package clients

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"airfield-board/internal/response"
)

func TestGroundControlGetMap(t *testing.T) {
	testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		req := GroundControlRequest{}
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			t.Fatal(err)
		}

		err = response.Json(w, GroundControlResponse{
			RoadMap: []int{1, 2, 3},
		})
		if err != nil {
			t.Fatal(err)
		}
	}))
	defer testServer.Close()

	roadMap, err := GroundControlGetMap(testServer.URL, "test_plane_id")
	if err != nil {
		t.Fatal(err)
	}

	if len(roadMap) != 3 {
		t.Fatalf("expected roadMap to have 3 elements, got %d", len(roadMap))
	}

	if !reflect.DeepEqual(roadMap, []int{1, 2, 3}) {
		t.Fatalf("expected roadMap to be [1, 2, 3], got %v", roadMap)
	}
}
