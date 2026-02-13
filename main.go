package main

import (
	"fmt"
	"log"
	"net/http"
	"smppmainhttpserver/handler"
	"smppmainhttpserver/i18n"
)

func main() {
	if err := i18n.Init(); err != nil {
		log.Fatalf("Failed to initialize i18n: %v", err)
	}

	// bij /link redirect nr chromewebstore
	http.HandleFunc("/link", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r,
			"https://chromewebstore.google.com/detail/smartschool++/bdhficnphioomdjhdfbhdepjgggekodf",
			http.StatusFound,
		)
	})

	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "content/static/favicon.ico")
	})
	http.HandleFunc("/set-lang", handler.SetLanguageHandler)
	http.HandleFunc("/set-mode", handler.SetModeHandler)
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./content/css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./content/js"))))
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./content/static"))))
	http.Handle("/media/", http.StripPrefix("/media/", http.FileServer(http.Dir("./content/media"))))

	http.HandleFunc("/", handler.DynamicHandler)

	port := "9000"
	fmt.Println("Starting Smartschool++ HTTP server on port: " + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
