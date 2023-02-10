package model

import "errors"

type PlaneType string

const (
	PlaneTypePassenger PlaneType = "Passenger"
	PlaneTypeCargo     PlaneType = "Cargo"
)

var ErrPlaneTypeNotSupported = errors.New("plane type not supported")

type Position struct {
	X uint
	Y uint
	Z uint
}

type Plane struct {
	ID     string
	Type   PlaneType
	Flight string

	Fuel  uint
	Speed uint

	MaxPassengers     uint
	CurrentPassengers uint

	MaxCargo     uint
	CurrentCargo uint

	Position Position

	MaxFood     uint
	CurrentFood uint
}

func CreatePlanByType(planeType PlaneType) (*Plane, error) {
	switch planeType {
	case PlaneTypePassenger:
		return &Plane{
			Type:              PlaneTypePassenger,
			MaxPassengers:     100,
			MaxCargo:          100,
			MaxFood:           100,
			CurrentPassengers: 100,
			CurrentCargo:      100,
			CurrentFood:       100,
		}, nil
	case PlaneTypeCargo:
		return &Plane{
			Type:          PlaneTypeCargo,
			MaxCargo:      100,
			CurrentCargo:  100,
			MaxFood:       100,
			CurrentFood:   100,
			MaxPassengers: 0,
		}, nil
	default:
		return nil, ErrPlaneTypeNotSupported
	}
}
