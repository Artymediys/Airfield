package config

import (
	"fmt"

	"github.com/caarlos0/env/v7"
)

type Config struct {
	Host     string `env:"HOST" envDefault:"localhost"`
	Port     string `env:"PORT" envDefault:"8080"`
	RabbitMQ struct {
		Host     string `env:"RABBITMQ_HOST" envDefault:"localhost"`
		Port     string `env:"RABBITMQ_PORT" envDefault:"5672"`
		Username string `env:"RABBITMQ_USERNAME" envDefault:"guest"`
		Password string `env:"RABBITMQ_PASSWORD" envDefault:"guest"`
	}
	Clients struct {
		GroundControlURL string `env:"GROUND_CONTROL_URL,required" envDefault:"http://localhost:8081"`
	}
}

func New() (*Config, error) {
	c := Config{}
	err := env.Parse(&c)

	return &c, err
}

func (c *Config) Addr() string {
	return fmt.Sprintf("%s:%s", c.Host, c.Port)
}

func (c *Config) RabbitMQAddr() string {
	return fmt.Sprintf("amqp://%s:%s@%s:%s/", c.RabbitMQ.Username, c.RabbitMQ.Password, c.RabbitMQ.Host, c.RabbitMQ.Port)
}
