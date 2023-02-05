package model

type PlaneType string

const (
	PlaneTypePassenger PlaneType = "Passenger"
	PlaneTypeCargo     PlaneType = "Cargo"
)

type Plane struct {
	ID   string
	Type PlaneType

	Fuel  uint
	Speed uint

	MaxPassengers     uint
	CurrentPassengers uint

	// TODO: add more fields
}
