package request

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"airfield-board/internal/response"
)

func TestPostJson(t *testing.T) {
	testServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := response.Json(w, response.Message{
			Message: "OK",
		})
		if err != nil {
			t.Fatal(err)
		}
	}))
	defer testServer.Close()

	body := map[string]string{
		"foo": "bar",
	}

	// encode body
	b, err := json.Marshal(body)
	if err != nil {
		t.Fatal(err)
	}

	res, err := PostJson[response.Message](testServer.URL, bytes.NewReader(b))
	if err != nil {
		t.Fatal(err)
	}

	if res.Message != "OK" {
		t.Fatalf("expected message to be 'OK', got '%s'", res.Message)
	}

	t.Logf("res: %v\n", res)
}
