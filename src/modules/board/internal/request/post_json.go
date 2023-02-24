package request

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func PostJSON[T any](url string, payload io.Reader) (T, error) {
	client := &http.Client{}
	var result T

	req, err := http.NewRequest(http.MethodPost, url, payload)
	if err != nil {
		return result, err
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")

	// Send request
	resp, err := client.Do(req)
	if err != nil {
		return result, err
	}
	// Close response body
	defer func(body io.ReadCloser) { _ = body.Close() }(resp.Body)

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return result, fmt.Errorf("request failed with status: %s", resp.Status)
	}

	// decode response
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return result, fmt.Errorf("failed to decode response: %w", err)
	}

	return result, nil
}
