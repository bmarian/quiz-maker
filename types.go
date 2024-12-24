package main

import (
	"context"
)

type App struct {
	ctx context.Context
}

type Settings struct {
	ApiKey string
	Theme string
}