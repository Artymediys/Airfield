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
		StartPoint: 2,
		EndPoint:   14,
	}

	// encode request
	data, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to encode request: %w", err)
	}

	res, err := request.PostJson(url, bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}

	// decode response
	resp := GroundControlResponse{}
	err = json.NewDecoder(res).Decode(&resp)
	if err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return resp.RoadMap, nil
}
