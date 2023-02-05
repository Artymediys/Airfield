package main

import (
	"airfield-board/internal/app"
	"airfield-board/internal/config"
	"airfield-board/internal/log"
	"airfield-board/internal/router"
)

func main() {
	lgr := log.New()
	cfg := config.New()
	r := router.New(lgr)
	a := app.New(cfg, r, lgr)

	err := a.Run()
	if err != nil {
		lgr.Error("Failed to run app", err)
	}
}
