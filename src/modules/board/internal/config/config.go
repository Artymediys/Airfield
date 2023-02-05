package config

import "fmt"

type Config struct {
	Host string
	Port string
}

func New() *Config {
	return &Config{
		Host: "localhost",
		Port: "8080",
	}
}

func (c *Config) Addr() string {
	return fmt.Sprintf("%s:%s", c.Host, c.Port)
}
