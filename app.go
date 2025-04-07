package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

const PORT = ":5029"
const SERVER_URL = "http://wails.localhost" + PORT

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) domReady(ctx context.Context) {
	runtime.WindowMaximise(ctx)
	runtime.WindowSetMinSize(ctx, 470, 200)
}

// Tabs endpoints

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

// Note endpoints

/*func (a *App) GetNotes(tabId int) []Note {
	notes := []Note{}

	rows, err := db.Query("SELECT * FROM notes WHERE tabId=? ORDER BY ID DESC", tabId)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var note Note
		if err := rows.Scan(&note.ID, &note.Title, &note.TabId, &note.IsDeleted); err != nil {
			log.Fatal(err)
		}
		notes = append(notes, note)
	}

	return notes
}*/

func (a *App) SearchNotes(tabId int, query string) []Note {
	notes := []Note{}

	searchTerm := "%" + query + "%"
	var rows *sql.Rows
	var err error
	if tabId == 1 {
		rows, err = db.Query("SELECT * FROM notes WHERE title LIKE ? AND IsDeleted LIKE 1 ORDER BY ID DESC", searchTerm)
	} else {
		rows, err = db.Query("SELECT * FROM notes WHERE tabId=? AND title LIKE ? AND IsDeleted LIKE 0 ORDER BY ID DESC", tabId, searchTerm)
	}
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var note Note
		if err := rows.Scan(&note.ID, &note.Title, &note.TabId, &note.IsDeleted); err != nil {
			log.Fatal(err)
		}
		notes = append(notes, note)
	}

	return notes
}

func (a *App) InsertNote(title string, tabId int) int64 {
	var res sql.Result
	var err error
	if tabId == 1 {
		res, err = db.Exec("INSERT INTO notes(title, tabId, IsDeleted) VALUES(?, ?, ?)", title, tabId, 1)
	} else {
		res, err = db.Exec("INSERT INTO notes(title, tabId) VALUES(?, ?)", title, tabId)
	}
	if err != nil {
		fmt.Println("Error inserting note(title, tabId) values: ", title, " into tab:", tabId)
		return 0
	}
	var id int64
	id, err = res.LastInsertId()
	if err != nil {
		fmt.Printf("Error while getting id to create folder on tab: %s", title)
		return 0
	}
	return id
}

func (a *App) UpdateNote(newTitle string, noteId int) bool {
	_, err := db.Exec("UPDATE notes SET title = ? WHERE ID = ?", newTitle, noteId)
	if err != nil {
		fmt.Println("Error updating note: ", noteId)
		return false
	}
	return true
}

func (a *App) RestoreNote(noteId int) bool {
	_, err := db.Exec("UPDATE notes SET IsDeleted = 0 WHERE ID = ?", noteId)
	if err != nil {
		fmt.Println("Error restoring the note: ", noteId)
		return false
	}
	return true
}

func (a *App) GetNoteById(noteId int) Note {
	var notes []Note
	rows, err := db.Query("SELECT * FROM notes WHERE ID=?", noteId)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var note Note
		if err := rows.Scan(&note.ID, &note.Title, &note.TabId, &note.IsDeleted); err != nil {
			log.Fatal(err)
		}
		notes = append(notes, note)
	}

	return notes[0]
}

func (a *App) DeleteNote(tabId int, noteId int) bool {

	note := a.GetNoteById(noteId)

	if note.IsDeleted {
		_, err := db.Exec("DELETE FROM notes WHERE ID=?", noteId)
		if err != nil {
			fmt.Println("Error deleting note: ", noteId)
			return false
		}
		err = os.RemoveAll(fmt.Sprintf("./Nite/%d/%d", tabId, noteId))
		if err != nil {
			fmt.Printf("Error while removing folder ./Nite/%d/%d\n", tabId, noteId)
		}
		return true
	} else {
		_, err := db.Exec("UPDATE notes SET IsDeleted = 1 WHERE ID = ?", noteId)
		if err != nil {
			fmt.Println("Error updating note: ", noteId)
			return false
		}
	}

	return true
}

func (a *App) SaveNote(tabId int, noteId int, value string) bool {
	data := []byte(value)
	err := a.WriteFile(fmt.Sprintf("./Nite/%d/%d/data.json", tabId, noteId), data)
	return err == nil
}

func (a *App) ReadNote(tabId int, noteId int) string {

	data, err := os.ReadFile(fmt.Sprintf("./Nite/%d/%d/data.json", tabId, noteId))
	if err != nil {
		return "{}"
	}
	return string(data)
}

func (a *App) DecodeData(data string) ([]byte, error) {
	var file []byte
	if err := json.Unmarshal([]byte(data), &file); err != nil {
		fmt.Println("Could not unmarshal the file data")
		return []byte{}, errors.New("could not unmarshal th file data")
	}
	return file, nil
}

func (a *App) SaveFile(fileData string, tabId int, noteId int, filename string) string {
	file, err := a.DecodeData(fileData)
	if err != nil {
		return ""
	}
	savePath := fmt.Sprintf("./Nite/%d/%d/assets/%s", tabId, noteId, filename)
	err = a.WriteFile(savePath, file)
	if err != nil {
		return ""
	}
	return fmt.Sprintf("%s/%d/%d/assets/%s", SERVER_URL, tabId, noteId, filename)
}

func (a *App) WriteFile(path string, file []byte) error {
	if err := os.MkdirAll(filepath.Join(path, ".."), 0755); err != nil {
		return err
	}
	if err := os.WriteFile(path, file, 0644); err != nil {
		fmt.Println("Error writing the file: ", path)
		return err
	}
	return nil
}

func (a *App) RemoveFile(path string) error {
	if !strings.Contains(path, "Nite") {
		fmt.Println(path)
		panic("Invalid remove file path received")
	}
	if err := os.Remove(path); err != nil {
		fmt.Println("Error while deleting the file: ", path)
		return err
	}
	return nil
}

func (a *App) ImageSize(fileData string) []int {
	file, err := a.DecodeData(fileData)
	if err != nil {
		fmt.Println("Error deconding data while getting image size")
	}
	r := bytes.NewReader(file)
	m, _, err := image.Decode(r)
	if err != nil {
		fmt.Println("Error while decoding the image")
	}
	bounds := m.Bounds()
	return []int{bounds.Dx(), bounds.Dy()}
}

func (a *App) CheckForZombieAssets(tabId int, noteId int) {
	dir := fmt.Sprintf("./Nite/%d/%d/assets", tabId, noteId)
	files := make([]string, 0)
	entries, err := os.ReadDir(dir)
	if err != nil {
		fmt.Println("Error while reading the directory: ", dir)
		return
	}
	for _, entry := range entries {
		if !entry.IsDir() {
			files = append(files, entry.Name())
		}
	}

	fileSet := make(map[string]bool, 0)
	var blocks map[string]Block
	filePath := fmt.Sprintf("./Nite/%d/%d/%s", tabId, noteId, "data.json")
	var bytes []byte
	bytes, err = os.ReadFile(filePath)
	if err != nil {
		fmt.Println("Error reading the file: ", filePath)
		return
	}

	err = json.Unmarshal(bytes, &blocks)
	if err != nil {
		fmt.Println("Error while decoding json file: ", filePath)
	}

	for _, block := range blocks {
		if block.Type == "Image" && block.Value[0].Type == "image" {
			// images
			imageUrl := strings.Split(block.Value[0].Props.Src, "/")
			fileKey := imageUrl[len(imageUrl)-1]
			fileSet[fileKey] = true
		}

		if block.Type == "Video" && block.Value[0].Type == "video" {
			// video
			videoUrl := strings.Split(block.Value[0].Props.Src, "/")
			fileKey := videoUrl[len(videoUrl)-1]
			fileSet[fileKey] = true

			//poster
			posterUrl := strings.Split(block.Value[0].Props.Poster, "/")
			fileKey = posterUrl[len(posterUrl)-1]
			fileSet[fileKey] = true
		}

		if block.Type == "File" && block.Value[0].Type == "file" {
			// video
			videoUrl := strings.Split(block.Value[0].Props.Src, "/")
			fileKey := videoUrl[len(videoUrl)-1]
			fileSet[fileKey] = true
		}

	}

	for _, file := range files {
		if !fileSet[file] {
			fileToDelete := fmt.Sprintf("%s/%s", dir, file)
			a.RemoveFile(fileToDelete)
		}
	}

}
