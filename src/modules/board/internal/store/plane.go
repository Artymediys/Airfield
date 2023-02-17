package store

import (
	"errors"
	"fmt"

	"airfield-board/internal/model"
)

type Plane struct {
	store map[string]*model.Plane
}

func NewPlane() *Plane {
	return &Plane{
		store: make(map[string]*model.Plane),
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

func (p *Plane) SavePlane(pl *model.Plane) error {
	if pl == nil {
		return ErrSaveEmptyPlane
	}

	p.store[pl.ID] = pl

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
