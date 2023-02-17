package model

import (
	"errors"

	"github.com/google/uuid"
)

type PlaneType string

const (
	PlaneTypePassenger PlaneType = "Passenger"
	PlaneTypeCargo     PlaneType = "Cargo"
)

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
