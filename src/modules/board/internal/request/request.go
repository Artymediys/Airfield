package request

import (
	"fmt"
	"io"
	"net/http"
)

func PostJson(url string, body io.Reader) (io.Reader, error) {
	// Create client and request
	client := &http.Client{}

	req, err := http.NewRequest(http.MethodPost, url, body)
	if err != nil {
		return nil, err
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")

	// Send request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	// Close response body
	defer func(body io.ReadCloser) { _ = body.Close() }(resp.Body)

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return resp.Body, fmt.Errorf("request failed with status: %s", resp.Status)
	}

	return resp.Body, nil
}
