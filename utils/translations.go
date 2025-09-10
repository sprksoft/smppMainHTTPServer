package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

type Translation struct {
	Translations map[string]interface{} `json:"translations"`
}

type TranslationManager struct {
	translations map[string]map[string]string // lang -> key -> translation
	mu           sync.RWMutex
	defaultLang  string
	supportedLangs []string
}

var (
	translationManager *TranslationManager
	once               sync.Once
)

func GetTranslationManager() *TranslationManager {
	once.Do(func() {
		translationManager = &TranslationManager{
			translations: make(map[string]map[string]string),
			defaultLang:  "en",
			supportedLangs: []string{"en", "nl"},
		}
		err := translationManager.LoadTranslations()
		if err != nil {
			log.Printf("Warning: Could not load translations: %v", err)
		}
	})
	return translationManager
}

func (tm *TranslationManager) LoadTranslations() error {
	tm.mu.Lock()
	defer tm.mu.Unlock()

	translationsDir := "content/translations"
	if _, err := os.Stat(translationsDir); os.IsNotExist(err) {
		return fmt.Errorf("translations directory not found")
	}

	files, err := os.ReadDir(translationsDir)
	if err != nil {
		return fmt.Errorf("failed to read translations directory: %w", err)
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		filename := file.Name()
		if !strings.HasSuffix(filename, ".json") {
			continue
		}

		lang := strings.TrimSuffix(filename, ".json")
		if !tm.isSupportedLanguage(lang) {
			continue
		}

		filePath := filepath.Join(translationsDir, filename)
		data, err := os.ReadFile(filePath)
		if err != nil {
			log.Printf("Failed to read translation file %s: %v", filePath, err)
			continue
		}

		var translation Translation
		if err := json.Unmarshal(data, &translation); err != nil {
			log.Printf("Failed to parse translation file %s: %v", filePath, err)
			continue
		}

		// Flatten nested translation structure
		flatTranslations := tm.flattenTranslations(translation.Translations)
		tm.translations[lang] = flatTranslations
		log.Printf("Loaded %d translations for language: %s", len(flatTranslations), lang)
	}

	return nil
}

func (tm *TranslationManager) flattenTranslations(translations map[string]interface{}) map[string]string {
	result := make(map[string]string)
	
	for key, value := range translations {
		switch v := value.(type) {
		case string:
			result[key] = v
		case map[string]interface{}:
			// Recursively flatten nested objects
			nested := tm.flattenTranslations(v)
			for nestedKey, nestedValue := range nested {
				result[key+"."+nestedKey] = nestedValue
			}
		case interface{}:
			// Handle other types by converting to string
			result[key] = fmt.Sprintf("%v", v)
		}
	}
	
	return result
}

func (tm *TranslationManager) isSupportedLanguage(lang string) bool {
	for _, supported := range tm.supportedLangs {
		if supported == lang {
			return true
		}
	}
	return false
}

func (tm *TranslationManager) Translate(lang, key string) string {
	tm.mu.RLock()
	defer tm.mu.RUnlock()

	// If language is not supported, fall back to default
	if !tm.isSupportedLanguage(lang) {
		lang = tm.defaultLang
	}

	if translations, exists := tm.translations[lang]; exists {
		if translation, exists := translations[key]; exists {
			return translation
		}
	}

	// Fall back to default language if translation not found
	if lang != tm.defaultLang {
		if translations, exists := tm.translations[tm.defaultLang]; exists {
			if translation, exists := translations[key]; exists {
				return translation
			}
		}
	}

	// Return key if no translation found
	return "[" + key + "]"
}

func (tm *TranslationManager) GetSupportedLanguages() []string {
	return tm.supportedLangs
}

func (tm *TranslationManager) GetDefaultLanguage() string {
	return tm.defaultLang
}

func (tm *TranslationManager) IsLanguageSupported(lang string) bool {
	return tm.isSupportedLanguage(lang)
}

// Helper function for direct translation calls
func T(lang, key string) string {
	return GetTranslationManager().Translate(lang, key)
}