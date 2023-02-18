package main

import (
	"math/rand"
	"time"

	"github.com/streadway/amqp"

	"airfield-board/internal/app"
	"airfield-board/internal/config"
	"airfield-board/internal/log"
	"airfield-board/internal/model"
	"airfield-board/internal/router"
	"airfield-board/internal/store"
)

func main() {
	lgr := log.New()
	cfg, err := config.New()
	if err != nil {
		lgr.Error("Failed to read config", err)
		return
	}

	planeStore := store.NewPlane()

	r := router.New(lgr, planeStore)
	a := app.New(cfg, r, lgr)

	rabbit, err := amqp.Dial(cfg.RabbitMQAddr())
	if err != nil {
		lgr.Error("Failed to connect to RabbitMQ", err)
		return
	}
	defer func(rabbit *amqp.Connection) {
		_ = rabbit.Close()
	}(rabbit)

	ch, err := rabbit.Channel()
	if err != nil {
		lgr.Error("Failed to open a channel", err)
		return
	}
	defer func(ch *amqp.Channel) {
		_ = ch.Close()
	}(ch)

	store.RMQChannel = ch

	err = ch.ExchangeDeclare("board", "direct", true, false, false, false, nil)
	if err != nil {
		lgr.Error("Failed to declare an exchange", err)
		return
	}

	_, err = ch.QueueDeclare("plane", true, false, false, false, nil)
	if err != nil {
		lgr.Error("Failed to declare a queue", err)
		return
	}

	err = ch.QueueBind("plane", "plane", "board", false, nil)
	if err != nil {
		lgr.Error("Failed to bind a queue", err)
		return
	}

	go func() {
		ticker := time.NewTicker(30 * time.Second)
		min := 0
		max := 30

		select {
		case <-ticker.C:
			lgr.Info("generate airplane")
			time.Sleep(time.Duration(rand.Intn(max-min)+min) * time.Second)

			p, err := model.CreatePlanByType(model.GetRandomType(), "")
			if err != nil {
				lgr.Error("Failed to create plain", err)
				return
			}

			if err := planeStore.SavePlane(p); err != nil {
				lgr.Error("failed to save plain", err)
			}
		}

	}()

	// read from queue
	consumeStream, err := ch.Consume("plane", "board", true, false, false, false, nil)
	if err != nil {
		lgr.Error("Failed to consume messages", err)
		return
	}

	lgr.Info("Waiting for messages")

	go func(consumed <-chan amqp.Delivery) {
		for d := range consumed {
			lgr.Info(string(d.Body))
		}
	}(consumeStream)

	err = a.Run()
	if err != nil {
		lgr.Error("Failed to run app", err)
	}
}