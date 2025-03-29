package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type Tab struct {
	ID    int
	Title string
}

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./nite.db")
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
}
