package model

import (
	"errors"
	"fmt"
	"math/rand"

	"github.com/google/uuid"
	"golang.org/x/exp/slog"

	"airfield-board/internal/clients"
	"airfield-board/internal/config"
)

type PlaneType string

const (
	PlaneTypePassenger PlaneType = "Passenger"
	PlaneTypeCargo     PlaneType = "Cargo"
)

func GetRandomType() PlaneType {
	types := []PlaneType{PlaneTypePassenger, PlaneTypeCargo}
	return types[rand.Intn(len(types))]
}

var ErrPlaneTypeNotSupported = errors.New("plane type not supported")

type Position struct {
	X int
	Y int
	Z int
}

type Plane struct {
	ID     string
	Type   PlaneType
	Flight string

	Fuel  uint
	Speed uint

	MaxPassengers     uint
	CurrentPassengers uint

	Passengers []string

	MaxCargo     uint
	CurrentCargo uint

	Position Position

	MaxFood     uint
	CurrentFood uint

	Height uint
}

func CreatePlanByType(planeType PlaneType, flight string) (*Plane, error) {

	switch planeType {
	case PlaneTypePassenger:
		return &Plane{
			ID:                uuid.NewString(),
			Type:              PlaneTypePassenger,
			MaxPassengers:     100,
			MaxCargo:          100,
			MaxFood:           100,
			CurrentPassengers: 100,
			CurrentCargo:      100,
			CurrentFood:       100,
			Flight:            flight,
			Passengers:        []string{},
			Height:            100,
		}, nil
	case PlaneTypeCargo:
		return &Plane{
			ID:            uuid.NewString(),
			Type:          PlaneTypeCargo,
			MaxCargo:      100,
			CurrentCargo:  100,
			MaxFood:       100,
			CurrentFood:   100,
			MaxPassengers: 0,
			Flight:        flight,
			Passengers:    []string{},
			Height:        100,
		}, nil
	default:
		return nil, ErrPlaneTypeNotSupported
	}
}

func (p *Plane) Start(cfg *config.Config) {
	// Perform lifecycle there
	// Listen to messages in plane and perform actions
	// ?

	slog.Info("Plane lifecycle started", slog.Group("plane", slog.String("id", p.ID)))

	slog.Info("Plane landed")

	roadMap, err := clients.GroundControlGetMap(fmt.Sprintf("%s/ground-control/road-map/board", cfg.Clients.GroundControlURL), p.ID)
	if err != nil {
		slog.Error("Can't get roadMap", err)
		return
	}

	slog.Info("Got new roadMap", slog.Any("map", roadMap))
}
