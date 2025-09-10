package handler

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
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

func SetLanguageHandler(w http.ResponseWriter, r *http.Request) {
	lang := r.URL.Query().Get("lang")
	redirect := r.URL.Query().Get("redirect")
	
	// Validate language
	tm := utils.GetTranslationManager()
	if !tm.IsLanguageSupported(lang) {
		lang = tm.GetDefaultLanguage()
	}

	// Set the language cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "lang",
		Value:    lang,
		Path:     "/",
		Expires:  time.Now().Add(365 * 24 * time.Hour),
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	})

	// Build the redirect URL with language prefix
	if redirect == "" || strings.Contains(redirect, "..") {
		redirect = "/"
	}
	
	// Remove existing language prefix if present
	path := redirect
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) > 0 && tm.IsLanguageSupported(parts[0]) {
		parts = parts[1:]
	}
	
	// Add new language prefix if it's not the default
	if lang != tm.GetDefaultLanguage() {
		parts = append([]string{lang}, parts...)
	}
	
	result := "/" + strings.Join(parts, "/")
	if result == "/" {
		redirect = result
	} else {
		redirect = strings.TrimSuffix(result, "/")
	}
	
	http.Redirect(w, r, redirect, http.StatusSeeOther)
}

func RenderTemplate(w http.ResponseWriter, tmpl string, data any) {
	// Extract lang from data using reflection
	var lang string = "en" // default fallback
	
	// Use reflection to extract Lang field from data
	v := reflect.ValueOf(data)
	if v.Kind() == reflect.Struct {
		field := v.FieldByName("Lang")
		if field.IsValid() && field.Kind() == reflect.String {
			lang = field.String()
		}
	}
	
	var redirect string = "/"
	// Use reflection to extract Redirect field from data
	if v.Kind() == reflect.Struct {
		field := v.FieldByName("Redirect")
		if field.IsValid() && field.Kind() == reflect.String {
			redirect = field.String()
		}
	}
	
	tm := utils.GetTranslationManager()
	
	t, err := template.New("template.html").Funcs(template.FuncMap{
		"T": func(key string) string {
			return tm.Translate(lang, key)
		},
		"Lang": func() string {
			return lang
		},
		"CurrentPath": func() string {
			return redirect
		},
		"LanguageURL": func(targetLang string) string {
			path := redirect
			parts := strings.Split(strings.Trim(path, "/"), "/")
			
			// Remove existing language prefix if present
			if len(parts) > 0 && tm.IsLanguageSupported(parts[0]) {
				parts = parts[1:]
			}
			
			// Add new language prefix if it's not the default
			if targetLang != tm.GetDefaultLanguage() {
				parts = append([]string{targetLang}, parts...)
			}
			
			result := "/" + strings.Join(parts, "/")
			if result == "/" {
				return result
			}
			return strings.TrimSuffix(result, "/")
		},
		"safeHTML": func(html string) template.HTML {
			return template.HTML(html)
		},
		"html": func(html string) template.HTML {
			return template.HTML(html)
		},
	}).ParseFiles("content/template/template.html", tmpl)
	
	if err != nil {
		http.Error(w, "404 Not Found", http.StatusNotFound)
		log.Printf("Failed to parse templates: %v, error: %v", tmpl, err)
		return
	}

	err = t.Execute(w, data)
	if err != nil {
		http.Error(w, "Error rendering template", http.StatusInternalServerError)
		log.Printf("Error executing template %s: %v", tmpl, err)
	}
}

func detectLanguage(r *http.Request) string {
	tm := utils.GetTranslationManager()
	
	// Check URL path for language prefix
	path := r.URL.Path
	parts := strings.Split(strings.Trim(path, "/"), "/")
	if len(parts) > 0 && tm.IsLanguageSupported(parts[0]) {
		return parts[0]
	}
	
	// Check cookie
	if cookie, err := r.Cookie("lang"); err == nil {
		if tm.IsLanguageSupported(cookie.Value) {
			return cookie.Value
		}
	}
	
	// Check Accept-Language header
	acceptLang := r.Header.Get("Accept-Language")
	if acceptLang != "" {
		// Simple parsing of Accept-Language header
		langs := strings.Split(acceptLang, ",")
		for _, lang := range langs {
			lang = strings.Split(strings.TrimSpace(lang), ";")[0]
			if strings.HasPrefix(lang, "nl") {
				return "nl"
			}
			if strings.HasPrefix(lang, "en") {
				return "en"
			}
		}
	}
	
	// Fall back to default
	return tm.GetDefaultLanguage()
}

func extractPageFromPath(path string, lang string) string {
	path = strings.Trim(path, "/")
	parts := strings.Split(path, "/")
	
	// Remove language prefix if present
	if len(parts) > 0 && parts[0] == lang {
		parts = parts[1:]
	}
	
	if len(parts) == 0 {
		return "index"
	}
	
	return strings.ToLower(parts[0])
}

func DynamicHandler(w http.ResponseWriter, r *http.Request) {
	// Detect language
	lang := detectLanguage(r)
	
	// Get translation manager
	tm := utils.GetTranslationManager()
	
	// Extract page from path
	page := extractPageFromPath(r.URL.Path, lang)
	
	// Get redirect path (without language prefix)
	redirectPath := r.URL.Path
	pathParts := strings.Split(strings.Trim(redirectPath, "/"), "/")
	if len(pathParts) > 0 && tm.IsLanguageSupported(pathParts[0]) {
		redirectPath = "/" + strings.Join(pathParts[1:], "/")
		if redirectPath == "/" {
			redirectPath = ""
		} else {
			redirectPath = strings.TrimSuffix(redirectPath, "/")
		}
	}
	
	pageTitle := tm.Translate(lang, "site_title")
	if page == "" || page == "index" {
		page = "index"
		pageTitle = tm.Translate(lang, "site_title")
	} else {
		pageTitle = tm.Translate(lang, page)
		if pageTitle == "["+page+"]" {
			// Fallback to original behavior if no translation exists
			pageTitle = utils.RemoveDash(page)
			pageTitle = utils.ToUpperCase(pageTitle)
		}
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
		pageTitle = tm.Translate(lang, "page_not_found")
	}

	var markdownHTML template.HTML

	// Try to load language-specific markdown first, then fallback to default
	var mdPath string
	if lang != "en" {
		mdPath = filepath.Join("content", "md", lang, page+".md")
		if _, err := os.Stat(mdPath); err == nil {
			// Language-specific markdown exists, use it
		} else {
			// Fallback to default markdown
			mdPath = filepath.Join("content", "md", page+".md")
		}
	} else {
		mdPath = filepath.Join("content", "md", page+".md")
	}

	if _, err := os.Stat(mdPath); err == nil {
		mdTextBytes, err := os.ReadFile(mdPath)
		if err != nil {
			http.Error(w, "Failed to read markdown", http.StatusInternalServerError)
			log.Println("Error reading "+mdPath+":", err)
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
		Lang         string
		SupportedLangs []string
	}{
		Page:         page,
		ThemeCSS:     cssThemeFile,
		MainCSS:      cssMainFile,
		MainJS:       jsMainFile,
		Redirect:     redirectPath,
		PageTitle:    pageTitle,
		Mode:         theme,
		IsMobile:     isMobile,
		MarkdownHTML: markdownHTML,
		Lang:         lang,
		SupportedLangs: tm.GetSupportedLanguages(),
	}

	RenderTemplate(w, tmplPath, data)
}
