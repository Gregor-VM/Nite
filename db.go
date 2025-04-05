package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

type Tab struct {
	ID    int
	Title string
}

type Note struct {
	ID        int
	Title     string
	TabId     int
	IsDeleted bool
}

var db *sql.DB

func initDB() {

	if err := os.MkdirAll("./Nite", 0755); err != nil {
		log.Fatal(err)
	}

	var err error
	db, err = sql.Open("sqlite3", "./Nite/nite.db")
	if err != nil {
		log.Fatal(err)
	}

	sqlStmt := `
	CREATE TABLE IF NOT EXISTS tabs (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	title TEXT
	);`

	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Fatalf("Error creating table: %q: %s\n", err, sqlStmt)
	}

	sqlStmt = `
	CREATE TABLE IF NOT EXISTS notes (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	title TEXT, TabId INTEGER DEFAULT 1 NOT NULL, IsDeleted BIT DEFAULT 0 NOT NULL
	);`

	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Fatalf("Error creating table: %q: %s\n", err, sqlStmt)
	}
}
