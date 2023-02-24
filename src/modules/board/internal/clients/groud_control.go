package clients

import (
	"bytes"
	"encoding/json"
	"fmt"

	"airfield-board/internal/request"
)

type GroundControlRequest struct {
	Type       string `json:"type"`
	PlaneID    string `json:"transportId"`
	StartPoint int    `json:"startPoint"`
	EndPoint   int    `json:"endPoint"`
}

type GroundControlResponse struct {
	PlaneID string `json:"transportId"`
	RoadMap []int  `json:"roadMap"`
}

func GroundControlGetMap(url string, planeID string) ([]int, error) {
	req := GroundControlRequest{
		Type:       "Board",
		PlaneID:    planeID,
		StartPoint: 8,
		EndPoint:   14,
	}

	// encode request
	data, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to encode request: %w", err)
	}

	resp, err := request.PostJSON[GroundControlResponse](url, bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}

	return resp.RoadMap, nil
}
