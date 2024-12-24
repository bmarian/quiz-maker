package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title: "Generator grile",
		Width: 1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind: []interface{}{ app },
		Mac: &mac.Options {
			Preferences: &mac.Preferences {
				FullscreenEnabled: mac.Enabled,
			},
	},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
