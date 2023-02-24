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
	/* LIFE CYCLE
	1. Самолет создан (сам или по запросу табло) и типа летит в сторону аэропорта
		Когда создан – запрашиваем у Пассажиров список id пассажиров
	2. Visualizer присылает нам, когда мы в зоне Диспетчера подхода
	3. Связываемся с ними и спрашиваем, можем ли сесть:
		Если да – отправляем сообщение Visualizer'у, что можем садится
		Если нет – отправляем сообщение Visualizer'у, что нужно сделать круг
	4. Когда самолет сел – получаем сообщение от Visualizer'а и делаем запрос к Управление наземным обслуживанием
	для машинки Follow me и дальнейшего обслуживания
	5. При прибытии на стоянку получаем сообщение с нашим местоположением и отдаем пассажиров и багаж
	6. Отправляем Коле при начале обслуживания наше местоположение
	7. Когда обслуживание закончено получаем новых пассажиров, топливо, багаж и еду.
	8. Запрашиваем у Коли маршрут движение по аэропорту до взлетной полосы
	9. На каждой контрольной точки запрашиваем можно ли продолжить движение:
		Если нельзя – ждем,
		Если можно говорим visualizer'у куда нам двигаться и когда проехали отрезок получаем об этом сообщение
		и пишем Коле, что мы свалили с отрезка
	10. Когда приехали до конца маршрута (взлетной полосы) – делаем запрос на взлет
	11. Когда можем взлетать – говорим Visualizer'у, что нужно отобразить взлет
	12. Говорим диспетчеру подхода, что взлетели
	13. Получаем от Visualizer'а сообщение о том, что самолет улетел и завершаем жизненный цикл самолета
	*/
	slog.Info("Plane lifecycle started", slog.Group("plane", slog.String("id", p.ID)))

	slog.Info("Plane landed")

	roadMap, err := clients.GroundControlGetMap(fmt.Sprintf("%s/ground-control/road-map", cfg.Clients.GroundControlURL), p.ID)
	if err != nil {
		slog.Error("Can't get roadMap", err)
		return
	}

	slog.Info("Got new roadMap", slog.Any("map", roadMap))
}
