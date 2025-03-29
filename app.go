package main

import (
	"context"
	"fmt"
	"log"
	"os"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetTabs() []Tab {
	tabs := []Tab{}

	rows, err := db.Query("SELECT id, title FROM tabs")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var tab Tab
		if err := rows.Scan(&tab.ID, &tab.Title); err != nil {
			log.Fatal(err)
		}
		tabs = append(tabs, tab)
	}

	if len(tabs) == 0 {

		a.InsertTab("Trash 🗑")

	}
	return tabs
}

func (a *App) InsertTab(title string) bool {
	res, err := db.Exec("INSERT INTO tabs(title) VALUES(?)", title)
	if err != nil {
		fmt.Println("Error inserting tabs(title) value: ", title)
		return false
	}
	var id int64
	id, err = res.LastInsertId()
	if err != nil {
		fmt.Printf("Error while getting id to create folder on tab: %s", title)
		return false
	}
	err = os.MkdirAll(fmt.Sprintf("./Nite/%d", id), os.ModePerm)
	if err != nil {
		fmt.Printf("Error while creating folder for tab ID %d\n", id)
	}
	return true
}

func (a *App) UpdateTab(tab Tab) bool {
	_, err := db.Exec("UPDATE tabs SET title = ? WHERE ID = ?", tab.Title, tab.ID)
	if err != nil {
		fmt.Println("Error updating tab: ", tab.ID)
		return false
	}
	return true
}

func (a *App) DeleteTab(tabId int) bool {
	_, err := db.Exec("DELETE FROM tabs WHERE ID=?", tabId)
	if err != nil {
		fmt.Println("Error deleting tab: ", tabId)
		return false
	}
	err = os.RemoveAll(fmt.Sprintf("./Nite/%d", tabId))
	if err != nil {
		fmt.Printf("Error while removing folder ./Nite/%d\n", tabId)
	}
	return true
}
