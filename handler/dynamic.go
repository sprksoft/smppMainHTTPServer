package handler

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"smppmainhttpserver/utils"
	"strings"
	"time"
)

func SetModeHandler(w http.ResponseWriter, r *http.Request) {
	mode := r.URL.Query().Get("mode")
	redirect := r.URL.Query().Get("redirect")
	if mode != "light" && mode != "dark" {
		mode = "dark"
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "mode",
		Value:    mode,
		Path:     "/",
		Expires:  time.Now().Add(365 * 24 * time.Hour),
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	})

	if redirect == "" || strings.Contains(redirect, "..") {
		redirect = "/"
	}
	http.Redirect(w, r, redirect, http.StatusSeeOther)
}

func RenderTemplate(w http.ResponseWriter, tmpl string, data any) {
	t, err := template.ParseFiles("content/template/template.html", tmpl)
	if err != nil {
		http.Error(w, "404 Not Found in renderTemplate", http.StatusNotFound)
		log.Printf("Failed to parse templates: %v, error: %v", tmpl, err)
		return
	}

	err = t.Execute(w, data)
	if err != nil {
		http.Error(w, "Error rendering template", http.StatusInternalServerError)
		log.Printf("Error executing template %s: %v", tmpl, err)
	}
}

func DynamicHandler(w http.ResponseWriter, r *http.Request) {
	page := strings.ToLower(r.URL.Path[1:])
	pageTitle := "Title"
	if page == "" {
		page = "index"
		pageTitle = "Smartschool++"
	} else {
		pageTitle = utils.RemoveDash(page)
		pageTitle = utils.ToUpperCase(pageTitle)
	}

	w.Header().Set("Accept-CH", "Sec-CH-Prefers-Color-Scheme")
	userAgent := r.Header.Get("User-Agent")
	isMobile := strings.Contains(strings.ToLower(userAgent), "mobile") ||
		strings.Contains(strings.ToLower(userAgent), "android") ||
		strings.Contains(strings.ToLower(userAgent), "iphone") ||
		strings.Contains(strings.ToLower(userAgent), "ipad") ||
		strings.Contains(strings.ToLower(userAgent), "windows phone")

	theme := r.Header.Get("Sec-CH-Prefers-Color-Scheme")
	if theme == "" {
		theme = "dark"
	}
	cookie, err := r.Cookie("mode")
	if err == nil {
		theme = cookie.Value
	}

	jsMainFile := page + ".js"
	jsMainFilePath := filepath.Join("content", "js", jsMainFile)
	if _, err := os.Stat(jsMainFilePath); os.IsNotExist(err) {
		jsMainFile = "null"
	}

	cssMainFile := page + ".css"
	cssMainFilePath := filepath.Join("content", "css", cssMainFile)
	if _, err := os.Stat(cssMainFilePath); os.IsNotExist(err) {
		cssMainFile = "null"
	}

	cssThemeFile := "light.css"
	if theme == "dark" {
		cssThemeFile = "dark.css"
	}

	tmplPath := filepath.Join("content", "html", page+".html")

	if _, err := os.Stat(tmplPath); os.IsNotExist(err) {
		page = "404"
		pageTitle = "404 Page Not Found"
	}

	var markdownHTML template.HTML

	markdownPath := filepath.Join("content", "md", page+".md")

	if _, err := os.Stat(markdownPath); err == nil {
		mdPath := filepath.Join("content", "md", page+".md")
		mdTextBytes, err := os.ReadFile(mdPath)
		if err != nil {
			http.Error(w, "Failed to read markdown", http.StatusInternalServerError)
			log.Println("Error reading "+page+".md:", err)
			return
		}
		// Parse the markdown to HTML
		markdownHTML = template.HTML(utils.ParseMd(string(mdTextBytes), page)) // Mark it as raw HTML
	}
	data := struct {
		Page         string
		ThemeCSS     string
		MainCSS      string
		MainJS       string
		Redirect     string
		PageTitle    string
		Mode         string
		IsMobile     bool
		MarkdownHTML template.HTML
	}{
		Page:         page,
		ThemeCSS:     cssThemeFile,
		MainCSS:      cssMainFile,
		MainJS:       jsMainFile,
		Redirect:     r.URL.Path,
		PageTitle:    pageTitle,
		Mode:         theme,
		IsMobile:     isMobile,
		MarkdownHTML: markdownHTML,
	}

	RenderTemplate(w, tmplPath, data)
}
