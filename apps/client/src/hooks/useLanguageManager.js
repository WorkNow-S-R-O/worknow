import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'react-intlayer';

/**
 * Custom hook for managing language switching with lazy loading
 * Only loads content for the selected language to optimize performance
 * Uses cookies to store language preference only when user explicitly selects a language
 */
export const useLanguageManager = () => {
  const { locale, setLocale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedLanguages, setLoadedLanguages] = useState(new Set([locale]));

  // Cookie utility functions
  const setCookie = useCallback((name, value, days = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }, []);

  const getCookie = useCallback((name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }, []);

  // Initialize with saved language or detect browser language
  useEffect(() => {
    // Check localStorage first (for backward compatibility)
    const savedLanguage = localStorage.getItem('worknow-language');
    
    // Check cookie for language preference
    const cookieLanguage = getCookie('worknow-language');
    
    // Use cookie preference if available, otherwise use localStorage
    const currentLanguage = cookieLanguage || savedLanguage;
    
    if (!currentLanguage) {
      // Auto-detect browser language
      const browserLang = navigator.language || navigator.languages[0];
      let detectedLang = 'ru'; // Default fallback
      
      console.log('🌍 Browser language detected:', browserLang);
      
      // Map browser language codes to our supported languages
      if (browserLang.startsWith('en')) {
        detectedLang = 'en';
      } else if (browserLang.startsWith('he') || browserLang.startsWith('iw')) {
        detectedLang = 'he';
      } else if (browserLang.startsWith('ar')) {
        detectedLang = 'ar';
      } else if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
        detectedLang = 'uk';
      } else if (browserLang.startsWith('ru')) {
        detectedLang = 'ru';
      }
      
      console.log('🌍 Setting language to:', detectedLang);
      
      // Set the detected language in localStorage (for backward compatibility)
      localStorage.setItem('worknow-language', detectedLang);
      setLocale(detectedLang);
      setLoadedLanguages(new Set([detectedLang]));
    } else {
      // Use saved language
      console.log('🌍 Using saved language:', currentLanguage);
      setLocale(currentLanguage);
      setLoadedLanguages(new Set([currentLanguage]));
    }
  }, [setLocale, getCookie]);

  // Language change handler with lazy loading and cookie storage
  const changeLanguage = useCallback(async (newLang) => {
    if (newLang === locale) return; // No change needed
    
    console.log('🌍 Changing language to:', newLang);
    setIsLoading(true);
    
    try {
      // Save to localStorage (for backward compatibility)
      localStorage.setItem('worknow-language', newLang);
      
      // Set cookie only when user explicitly selects a language
      setCookie('worknow-language', newLang, 365); // Expires in 1 year
      console.log('🍪 Language preference saved to cookie');
      
      // Add to loaded languages set
      setLoadedLanguages(prev => new Set([...prev, newLang]));
      
      // Set the new locale
      setLocale(newLang);
      
      console.log('🌍 Language changed successfully to:', newLang);
      
      // Reload page to apply the new language content
      // This ensures all components get the new language content
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Error changing language:', error);
      // Fallback to previous language
      setLocale(locale);
    } finally {
      setIsLoading(false);
    }
  }, [locale, setLocale, setCookie]);

  // Check if a language is loaded
  const isLanguageLoaded = useCallback((lang) => {
    return loadedLanguages.has(lang);
  }, [loadedLanguages]);

  // Get available languages
  const availableLanguages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'he', name: 'עברית' },
    { code: 'ar', name: 'العربية' },
    { code: 'uk', name: 'Українська' }
  ];

  // Clear language preference (for testing)
  const clearLanguagePreference = useCallback(() => {
    localStorage.removeItem('worknow-language');
    document.cookie = 'worknow-language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('🗑️ Language preference cleared');
    window.location.reload();
  }, []);

  return {
    currentLocale: locale,
    isLoading,
    changeLanguage,
    isLanguageLoaded,
    availableLanguages,
    loadedLanguages: Array.from(loadedLanguages),
    clearLanguagePreference
  };
};
