package main

import (
	"context"
	"encoding/json"
	"os"
)

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LoadSettings() any {
	var settingsFileLocation = "./settings.json";
	var settings Settings;

	bytes, err := os.ReadFile(settingsFileLocation);
	if err != nil { panic(err); }

	err = json.Unmarshal(bytes, &settings);
	if err != nil { panic(err); }

	return settings;
}

func (a *App) SaveSettings(settings string) bool {
	var settingsFileLocation = "./settings.json";
	bytes := []byte(settings)

	err := os.WriteFile(settingsFileLocation, bytes, 0777);
	return err == nil;
}