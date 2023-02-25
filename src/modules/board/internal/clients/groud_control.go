package clients

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"

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

type GroundControlLocationRequest struct {
	BoardID  string `json:"boardId"`
	Location string `json:"location"`
}

type GroundControlLocationResponse struct {
	Status string `json:"status"`
}

func GroundControlLocation(url, planeID, location string) error {
	req := GroundControlLocationRequest{
		BoardID:  planeID,
		Location: location,
	}

	// encode request
	data, err := json.Marshal(req)
	if err != nil {
		return fmt.Errorf("failed to encode request: %w", err)
	}

	r, err := request.PostJSON[GroundControlLocationResponse](url, bytes.NewReader(data))
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}

	log.Println(r)

	return nil
}
