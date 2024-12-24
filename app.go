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

func (a *App) LoadCategories() any {
	var categoriesFileLocation = "./categories.json";
	var categories []Category;

	bytes, err := os.ReadFile(categoriesFileLocation);
	if err != nil { return nil; }

	err = json.Unmarshal(bytes, &categories);
	if err != nil { return nil; }

	return categories;
}

func (a *App) SaveCategories(categories string) bool {
	var categoriesFileLocation = "./categories.json";
	bytes := []byte(categories);
	
	err := os.WriteFile(categoriesFileLocation, bytes, 0644);
	return err == nil;
}

func (a *App) SaveLabels(labels string) bool {
	var labelsFileLocation = "./labels.json";
	bytes := []byte(labels);
	
	err := os.WriteFile(labelsFileLocation, bytes, 0644);
	return err == nil;
}

func (a *App) LoadLabels() any {
	var labelsFileLocation = "./labels.json";
	var labels []Label;

	bytes, err := os.ReadFile(labelsFileLocation);
	if err != nil { return nil; }

	err = json.Unmarshal(bytes, &labels);
	if err != nil { return nil; }

	return labels;
}

func (a *App) SaveQuestions(questions string) bool {
	var questionsFileLocation = "./questions.json";
	bytes := []byte(questions);
	
	err := os.WriteFile(questionsFileLocation, bytes, 0644);
	return err == nil;
}

func (a *App) LoadQuestions() any {
	var questionsFileLocation = "./questions.json";
	var questions []Question;

	bytes, err := os.ReadFile(questionsFileLocation);
	if err != nil { return nil; }

	err = json.Unmarshal(bytes, &questions);
	if err != nil { return nil; }

	return questions;
}