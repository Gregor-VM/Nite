package main

import (
	"embed"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	initDB()
	go ServeStaticFiles()
	defer db.Close()

	// Create an instance of the app structure
	app := NewApp()
	frameless := false

	if runtime.GOOS == "windows" {
		frameless = true
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "nite",
		Width:  1080,
		Height: 720,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Frameless:        frameless,
		BackgroundColour: &options.RGBA{R: 10, G: 10, B: 10, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
