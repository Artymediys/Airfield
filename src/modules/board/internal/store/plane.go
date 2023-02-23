package store

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/streadway/amqp"

	"airfield-board/internal/config"
	"airfield-board/internal/model"
)

var RMQChannel *amqp.Channel

type Plane struct {
	store map[string]*model.Plane
}

func NewPlane() *Plane {
	testPlane := model.Plane{
		ID:                "test-plane",
		Type:              model.PlaneTypeCargo,
		Flight:            "test",
		Fuel:              100,
		Speed:             1000,
		MaxPassengers:     100,
		CurrentPassengers: 3,
		Passengers:        []string{"a", "b", "c"},
		MaxCargo:          200,
		CurrentCargo:      12,
		Position: model.Position{
			X: 12,
			Y: 24,
			Z: 36,
		},
		MaxFood:     100,
		CurrentFood: 97,
		Height:      1000,
	}

	return &Plane{
		store: map[string]*model.Plane{
			testPlane.ID: &testPlane,
		},
	}
}

var (
	ErrSaveEmptyPlane = errors.New("can't store empty (nil) plane")
	ErrGetPlaneByID   = errors.New("can't get plane by id")
	ErrRemovePlane    = errors.New("no plane to remove")
)

func (p *Plane) GetPlane(planeID string) (*model.Plane, error) {
	pl, ok := p.store[planeID]
	if !ok {
		return nil, ErrGetPlaneByID
	}

	return pl, nil
}

type PlaneCreationEvent struct {
	Sender string `json:"sender"`
	ID     string `json:"id"`
	Type   string `json:"type"`
}

const senderName = "Board"

func (p *Plane) SavePlane(cfg *config.Config, pl *model.Plane) error {
	if pl == nil {
		return ErrSaveEmptyPlane
	}

	event := PlaneCreationEvent{
		Sender: senderName,
		ID:     pl.ID,
		Type:   string(pl.Type),
	}

	body, err := json.Marshal(event)
	if err != nil {
		return err
	}

	if err = RMQChannel.Publish("Visualizer", "Visualizer", false, false, amqp.Publishing{
		Body: body,
	}); err != nil {
		return err
	}

	p.store[pl.ID] = pl

	// Start plane lifecycle
	go pl.Start(cfg)

	return nil
}

func (p *Plane) RemovePlane(planeID string) error {
	if _, ok := p.store[planeID]; !ok {
		return fmt.Errorf("plane id: %s %w", planeID, ErrRemovePlane)
	}

	delete(p.store, planeID)

	return nil
}

func (p *Plane) GetCoords(planeID string) (*model.Position, error) {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return nil, err
	}

	return &pl.Position, nil
}

func (p *Plane) SetCoords(planeID string, pos *model.Position) error {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return err
	}

	pl.Position = *pos

	return nil
}

func (p *Plane) SetPassengers(planeID string, passengers []string) error {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return err
	}

	pl.Passengers = passengers

	return nil
}

func (p *Plane) GetPassengers(planeID string) ([]string, error) {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return nil, err
	}

	return pl.Passengers, nil
}

func (p *Plane) SetHeight(planeID string, height uint) error {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return err
	}

	pl.Height = height

	return nil
}

func (p *Plane) GetHeight(planeID string) (uint, error) {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return 0, err
	}

	return pl.Height, nil
}

func (p *Plane) SetSpeed(planeID string, speed uint) error {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return err
	}

	pl.Speed = speed

	return nil
}

func (p *Plane) GetSpeed(planeID string) (uint, error) {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return 0, err
	}

	return pl.Speed, nil
}

func (p *Plane) SetFuel(planeID string, fuel uint) error {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return err
	}

	pl.Fuel = fuel

	return nil
}

func (p *Plane) GetFuel(planeID string) (uint, error) {
	pl, err := p.GetPlane(planeID)
	if err != nil {
		return 0, err
	}

	return pl.Fuel, nil
}

func (p *Plane) DoByModule(module string, state string, planeID string, payload uint) (uint, error) {
	plane, err := p.GetPlane(planeID)
	if err != nil {
		return 0, err
	}

	switch module {
	case "food":
		switch state {
		case "add":
			if plane.CurrentFood+payload > plane.MaxFood {
				return plane.CurrentFood, fmt.Errorf("plane can't eat more than %d", plane.MaxFood)
			}

			plane.CurrentFood += payload

			return plane.CurrentCargo, nil

		case "get":
			return plane.CurrentFood, nil
		}

	case "cargo":
		switch state {
		case "add":
			if plane.CurrentCargo+payload > plane.MaxCargo {
				return plane.CurrentCargo, fmt.Errorf("plane can't carry more than %d", plane.MaxCargo)
			}

			plane.CurrentCargo += payload

			return plane.CurrentCargo, nil

		case "get":
			return plane.CurrentCargo, nil
		}
	}

	return 0, fmt.Errorf("unknown module: %s", module)
}
