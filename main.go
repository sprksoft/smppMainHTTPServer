package main

import (
	"fmt"
	"log"
	"net/http"
	"smppmainhttpserver/handler"
)

func main() {
	http.HandleFunc("/", handler.DynamicHandler)
	http.HandleFunc("/set-mode", handler.SetModeHandler)
	http.HandleFunc("/set-language", handler.SetLanguageHandler)
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./content/css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./content/js"))))
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./content/static"))))
	http.Handle("/media/", http.StripPrefix("/media/", http.FileServer(http.Dir("./content/media"))))
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "content/static/smpp_logo128.png")
	})

	port := "9000"
	fmt.Println("Starting Smartschool++ HTTP server on port: " + port)
	fmt.Println("http://localhost:" + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
