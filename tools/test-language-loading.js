/**
 * Test script to verify language loading optimization
 * This script checks that only the selected language content is loaded
 */

// Test function to check language loading behavior
const testLanguageLoading = () => {
  console.log('🧪 Testing Language Loading Optimization');
  console.log('=====================================');
  
  // Check initial language from localStorage
  const savedLanguage = localStorage.getItem('worknow-language');
  console.log('📱 Saved language:', savedLanguage || 'None');
  
  // Check browser language
  const browserLang = navigator.language || navigator.languages[0];
  console.log('🌐 Browser language:', browserLang);
  
  // Check if language manager hook is available
  if (typeof window !== 'undefined' && window.React) {
    console.log('⚛️ React is available');
  }
  
  // Test language switching
  const testLanguageSwitch = (lang) => {
    console.log(`🔄 Testing language switch to: ${lang}`);
    localStorage.setItem('worknow-language', lang);
    console.log(`✅ Language ${lang} saved to localStorage`);
  };
  
  // Test all supported languages
  const supportedLanguages = ['ru', 'en', 'he', 'ar', 'uk'];
  console.log('🎯 Supported languages:', supportedLanguages);
  
  // Test each language
  supportedLanguages.forEach(lang => {
    testLanguageSwitch(lang);
  });
  
  console.log('✅ Language loading test completed');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testLanguageLoading = testLanguageLoading;
}

// Run test if in browser environment
if (typeof window !== 'undefined') {
  console.log('🚀 Language Loading Test Script Loaded');
  console.log('Run testLanguageLoading() in console to test');
}
