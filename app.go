package main

import (
	"context"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx;
}

func (a *App) LoadSettings() any {
	var settingsFileLocation = "./settings.json";
	var settings Settings;

	bytes, err := os.ReadFile(settingsFileLocation);
	if err != nil { return nil; }

	err = json.Unmarshal(bytes, &settings);
	if err != nil { return nil; }

	return settings;
}

func (a *App) SaveSettings(settings string) bool {
	var settingsFileLocation = "./settings.json";
	bytes := []byte(settings);
	
	err := os.WriteFile(settingsFileLocation, bytes, 0644);
	return err == nil;
}

func (a *App) OpenConfigFolder(settings string) bool {
	ex, err := os.Executable();
	if err != nil { return false; }

	folderPath := filepath.Dir(ex);

	var cmd *exec.Cmd;
	switch runtime.GOOS {
		case "windows":
			cmd = exec.Command("explorer", folderPath);
		case "darwin":
			cmd = exec.Command("open", folderPath);
		case "linux":
			cmd = exec.Command("xdg-open", folderPath);
		default:
			return false;
	}

	cmd.Start();
	return true;
}