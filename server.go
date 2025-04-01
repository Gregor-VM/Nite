package main

import (
	"fmt"
	"net/http"
)

func ServeStaticFiles() {

	fs := http.FileServer(http.Dir("./Nite"))
	http.Handle("/", fs)
	err := http.ListenAndServe(PORT, nil)
	if err != nil {
		fmt.Println("Error while starting the server")
	}

}
