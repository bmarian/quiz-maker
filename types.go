package main

import (
	"context"
)

type App struct {
	ctx context.Context
}

type Settings struct {
	ApiKey string `json:apiKey`
	Theme string `json:theme`
}