# WorkNow Internationalization (i18n) Guide

## Overview

WorkNow is a multilingual platform supporting **4 languages**: Russian, English, Hebrew, and Arabic. The internationalization system provides seamless language switching, RTL support, and localized content for users in Israel and beyond.

## Supported Languages

| Language | Code | Direction | Primary Market | Status |
|----------|------|-----------|----------------|---------|
| **Russian** | `ru` | LTR | Russian-speaking immigrants | ✅ Complete |
| **English** | `en` | LTR | International users | ✅ Complete |
| **Hebrew** | `he` | RTL | Israeli market | ✅ Complete |
| **Arabic** | `ar` | RTL | Arabic-speaking users | ✅ Complete |

## Technology Stack

### Core Libraries
- **i18next**: Internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection
- **@clerk/localizations**: Clerk authentication localization

### Key Features
- **Automatic language detection** based on browser settings
- **Manual language switching** with persistent storage
- **RTL support** for Hebrew and Arabic
- **Dynamic content loading** without page refresh
- **SEO-friendly** URL structure

## Setup and Configuration

### 1. i18next Configuration

```typescript
// src/18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ruTranslation from '../public/locales/ru/translation.json';
import enTranslation from '../public/locales/en/translation.json';
import heTranslation from '../public/locales/he/translation.json';
import arTranslation from '../public/locales/ar/translation.json';

const resources = {
  ru: {
    translation: ruTranslation
  },
  en: {
    translation: enTranslation
  },
  he: {
    translation: heTranslation
  },
  ar: {
    translation: arTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'worknow_language'
    }
  });

export default i18n;
```

### 2. Clerk Localization

```jsx
// src/App.jsx
import { ClerkProvider } from '@clerk/clerk-react';
import { he, ar, ru, enUS } from '@clerk/localizations';

const localizations = {
  he,
  ar,
  ru,
  en: enUS
};

function App() {
  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      localization={localizations}
    >
      <Router>
        <AppContent />
      </Router>
    </ClerkProvider>
  );
}
```

### 3. Language Store

```typescript
// src/store/languageStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'en',
      setLanguage: (lang: string) => set({ currentLanguage: lang }),
      isLoading: false,
      setIsLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'worknow-language-storage'
    }
  )
);
```

## Translation File Structure

### 1. File Organization

```
public/locales/
├── ru/
│   └── translation.json
├── en/
│   └── translation.json
├── he/
│   └── translation.json
└── ar/
    └── translation.json
```

### 2. Translation Structure

```json
// public/locales/en/translation.json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "filter": "Filter",
    "clear": "Clear"
  },
  "navigation": {
    "home": "Home",
    "jobs": "Jobs",
    "seekers": "Job Seekers",
    "premium": "Premium",
    "profile": "Profile",
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out"
  },
  "jobs": {
    "title": "Job Title",
    "salary": "Salary",
    "description": "Description",
    "location": "Location",
    "category": "Category",
    "contact": "Contact",
    "posted": "Posted",
    "boost": "Boost Job",
    "create": "Create Job",
    "edit": "Edit Job",
    "delete": "Delete Job"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email",
      "minLength": "Minimum length is {{min}} characters",
      "maxLength": "Maximum length is {{max}} characters"
    }
  },
  "premium": {
    "title": "Premium Features",
    "basic": "Premium Basic",
    "deluxe": "Premium Deluxe",
    "price": "{{price}}/month",
    "features": {
      "jobBoosting": "Job Boosting",
      "extendedStats": "Extended Statistics",
      "prioritySupport": "Priority Support",
      "unlimitedPostings": "Unlimited Job Postings"
    }
  }
}
```

### 3. Hebrew Translation Example

```json
// public/locales/he/translation.json
{
  "common": {
    "loading": "טוען...",
    "error": "שגיאה",
    "success": "הצלחה",
    "cancel": "ביטול",
    "save": "שמור",
    "delete": "מחק",
    "edit": "ערוך",
    "search": "חיפוש",
    "filter": "סינון",
    "clear": "נקה"
  },
  "navigation": {
    "home": "בית",
    "jobs": "משרות",
    "seekers": "מחפשי עבודה",
    "premium": "פרימיום",
    "profile": "פרופיל",
    "signIn": "התחברות",
    "signUp": "הרשמה",
    "signOut": "התנתקות"
  }
}
```

### 4. Arabic Translation Example

```json
// public/locales/ar/translation.json
{
  "common": {
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح",
    "cancel": "إلغاء",
    "save": "حفظ",
    "delete": "حذف",
    "edit": "تعديل",
    "search": "بحث",
    "filter": "تصفية",
    "clear": "مسح"
  },
  "navigation": {
    "home": "الرئيسية",
    "jobs": "الوظائف",
    "seekers": "الباحثون عن عمل",
    "premium": "مميز",
    "profile": "الملف الشخصي",
    "signIn": "تسجيل الدخول",
    "signUp": "إنشاء حساب",
    "signOut": "تسجيل الخروج"
  }
}
```

## Language Switching Implementation

### 1. Language Switcher Component

```jsx
// src/components/LanguageSwitcher.jsx
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../store/languageStore';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLanguageChange = async (langCode: string) => {
    try {
      setLanguage(langCode);
      await i18n.changeLanguage(langCode);
      
      // Update document direction for RTL languages
      document.documentElement.dir = ['he', 'ar'].includes(langCode) ? 'rtl' : 'ltr';
      document.documentElement.lang = langCode;
      
      // Store in localStorage
      localStorage.setItem('worknow_language', langCode);
      
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  return (
    <div className="language-switcher">
      <div className="dropdown">
        <button className="dropdown-toggle">
          {languages.find(lang => lang.code === currentLanguage)?.flag}
          <span className="current-lang">
            {languages.find(lang => lang.code === currentLanguage)?.name}
          </span>
        </button>
        
        <div className="dropdown-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`dropdown-item ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="flag">{language.flag}</span>
              <span className="name">{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2. Navbar Integration

```jsx
// src/components/Navbar.jsx
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/images/logo.svg" alt="WorkNow" />
      </div>
      
      <div className="navbar-menu">
        <a href="/" className="nav-link">{t('navigation.home')}</a>
        <a href="/jobs" className="nav-link">{t('navigation.jobs')}</a>
        <a href="/seekers" className="nav-link">{t('navigation.seekers')}</a>
        <a href="/premium" className="nav-link">{t('navigation.premium')}</a>
      </div>
      
      <div className="navbar-end">
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </nav>
  );
}
```

## RTL Support Implementation

### 1. CSS RTL Classes

```css
/* src/css/rtl-support.css */
[dir="rtl"] {
  /* Text alignment */
  text-align: right;
  
  /* Margins and paddings */
  .ml-auto { margin-left: unset !important; margin-right: auto !important; }
  .mr-auto { margin-right: unset !important; margin-left: auto !important; }
  
  /* Flexbox order */
  .flex-row { flex-direction: row-reverse; }
  
  /* Icons and arrows */
  .icon-left { transform: scaleX(-1); }
  .arrow-right { transform: rotate(180deg); }
}

/* RTL-specific components */
[dir="rtl"] .job-card {
  border-radius: 0 8px 8px 0;
}

[dir="rtl"] .form-group label {
  text-align: right;
}

[dir="rtl"] .btn-icon {
  margin-right: 0;
  margin-left: 8px;
}
```

### 2. RTL Component Wrapper

```jsx
// src/components/RTLWrapper.jsx
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function RTLWrapper({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language;
    const isRTL = ['he', 'ar'].includes(currentLang);
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Add RTL class to body
    document.body.classList.toggle('rtl', isRTL);
    
  }, [i18n.language]);

  return children;
}
```

### 3. RTL-Aware Components

```jsx
// src/components/JobCard.jsx
import { useTranslation } from 'react-i18next';

function JobCard({ job }) {
  const { t } = useTranslation();
  const isRTL = ['he', 'ar'].includes(i18n.language);

  return (
    <div className={`job-card ${isRTL ? 'rtl' : ''}`}>
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
        <div className={`job-meta ${isRTL ? 'rtl' : ''}`}>
          <span className="salary">{job.salary}</span>
          <span className="location">{job.city.name}</span>
        </div>
      </div>
      
      <p className="job-description">{job.description}</p>
      
      <div className={`job-actions ${isRTL ? 'rtl' : ''}`}>
        <button className="btn btn-primary">
          {t('jobs.contact')}
        </button>
        <button className="btn btn-secondary">
          {t('jobs.edit')}
        </button>
      </div>
    </div>
  );
}
```

## Dynamic Content Translation

### 1. Database Translations

```sql
-- Cities with translations
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE city_translations (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id),
  lang VARCHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  UNIQUE(city_id, lang)
);

-- Categories with translations
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  lang VARCHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  UNIQUE(category_id, lang)
);
```

### 2. Translation Service

```javascript
// server/services/translationService.js
import { prisma } from '../lib/prisma.js';

export const getTranslatedCities = async (language = 'en') => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        translations: {
          where: { lang: language },
          select: { name: true }
        }
      }
    });

    return cities.map(city => ({
      id: city.id,
      name: city.translations[0]?.name || city.name,
      originalName: city.name
    }));
  } catch (error) {
    console.error('Failed to fetch translated cities:', error);
    throw error;
  }
};

export const getTranslatedCategories = async (language = 'en') => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        translations: {
          where: { lang: language },
          select: { name: true }
        }
      }
    });

    return categories.map(category => ({
      id: category.id,
      name: category.translations[0]?.name || category.name,
      originalName: category.name
    }));
  } catch (error) {
    console.error('Failed to fetch translated categories:', error);
    throw error;
  }
};
```

### 3. Frontend Integration

```jsx
// src/hooks/useFetchCities.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useFetchCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchCities();
  }, [i18n.language]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cities?lang=${i18n.language}`);
      const data = await response.json();
      
      if (data.success) {
        setCities(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  };

  return { cities, loading, error, refetch: fetchCities };
};
```

## SEO and Meta Tags

### 1. Dynamic Meta Tags

```jsx
// src/components/SEOHead.jsx
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

function SEOHead({ title, description, keywords }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = ['he', 'ar'].includes(currentLang);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Language and direction */}
      <html lang={currentLang} dir={isRTL ? 'rtl' : 'ltr'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={currentLang} />
      
      {/* Twitter Card */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Alternate languages */}
      <link rel="alternate" hreflang="ru" href={`/ru${window.location.pathname}`} />
      <link rel="alternate" hreflang="en" href={`/en${window.location.pathname}`} />
      <link rel="alternate" hreflang="he" href={`/he${window.location.pathname}`} />
      <link rel="alternate" hreflang="ar" href={`/ar${window.location.pathname}`} />
    </Helmet>
  );
}
```

### 2. URL Structure

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* Language-specific routes */}
      <Route path="/:lang" element={<LanguageRoute />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="seekers" element={<Seekers />} />
        <Route path="premium" element={<Premium />} />
      </Route>
      
      {/* Default route redirects to user's language */}
      <Route path="*" element={<LanguageRedirect />} />
    </Routes>
  );
}

// Language route wrapper
function LanguageRoute() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  return <Outlet />;
}

// Language redirect component
function LanguageRedirect() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const userLang = i18n.language || 'en';
    navigate(`/${userLang}${window.location.pathname}`);
  }, []);
  
  return <div>Redirecting...</div>;
}
```

## Form Validation and Localization

### 1. Localized Validation Messages

```jsx
// src/components/forms/JobForm.jsx
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

function JobForm() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="title">{t('jobs.title')}</label>
        <input
          id="title"
          {...register('title', { 
            required: t('forms.validation.required'),
            minLength: {
              value: 3,
              message: t('forms.validation.minLength', { min: 3 })
            }
          })}
        />
        {errors.title && (
          <span className="error-message">{errors.title.message}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">{t('jobs.description')}</label>
        <textarea
          id="description"
          {...register('description', { 
            required: t('forms.validation.required'),
            maxLength: {
              value: 1000,
              message: t('forms.validation.maxLength', { max: 1000 })
            }
          })}
        />
        {errors.description && (
          <span className="error-message">{errors.description.message}</span>
        )}
      </div>
      
      <button type="submit" className="btn btn-primary">
        {t('jobs.create')}
      </button>
    </form>
  );
}
```

### 2. Date and Number Formatting

```jsx
// src/utils/formatting.js
import { useTranslation } from 'react-i18next';

export const useFormattedDate = () => {
  const { i18n } = useTranslation();
  
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat(i18n.language, {
      ...defaultOptions,
      ...options
    }).format(new Date(date));
  };
  
  return { formatDate };
};

export const useFormattedNumber = () => {
  const { i18n } = useTranslation();
  
  const formatNumber = (number, options = {}) => {
    const defaultOptions = {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(i18n.language, {
      ...defaultOptions,
      ...options
    }).format(number);
  };
  
  return { formatNumber };
};
```

## Testing Internationalization

### 1. Test Scripts

```bash
# Test language switching
npm run test:i18n

# Test RTL support
npm run test:rtl

# Test translation completeness
npm run test:translations
```

### 2. Test Examples

```javascript
// tests/i18n.test.js
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/18n';
import JobCard from '../src/components/JobCard';

describe('Internationalization', () => {
  test('displays content in Russian', async () => {
    await i18n.changeLanguage('ru');
    
    render(
      <I18nextProvider i18n={i18n}>
        <JobCard job={mockJob} />
      </I18nextProvider>
    );
    
    expect(screen.getByText('Создать работу')).toBeInTheDocument();
  });
  
  test('displays content in Hebrew', async () => {
    await i18n.changeLanguage('he');
    
    render(
      <I18nextProvider i18n={i18n}>
        <JobCard job={mockJob} />
      </I18nextProvider>
    );
    
    expect(screen.getByText('צור עבודה')).toBeInTheDocument();
  });
  
  test('applies RTL for Arabic', async () => {
    await i18n.changeLanguage('ar');
    
    render(
      <I18nextProvider i18n={i18n}>
        <JobCard job={mockJob} />
      </I18nextProvider>
    );
    
    expect(document.documentElement.dir).toBe('rtl');
  });
});
```

## Performance Optimization

### 1. Lazy Loading Translations

```javascript
// src/18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: {} },
      ru: { translation: {} },
      he: { translation: {} },
      ar: { translation: {} }
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    
    // Lazy load translations
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
      addPath: '/locales/add/{{lng}}/{{ns}}'
    }
  });

export default i18n;
```

### 2. Translation Caching

```javascript
// src/utils/translationCache.js
class TranslationCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

export const translationCache = new TranslationCache();
```

## Troubleshooting

### Common Issues

1. **Translations Not Loading**
   - Check file paths and structure
   - Verify JSON syntax
   - Check browser console for errors

2. **Language Not Switching**
   - Verify i18n.changeLanguage() calls
   - Check localStorage permissions
   - Review language store state

3. **RTL Not Working**
   - Verify CSS RTL classes
   - Check document.documentElement.dir
   - Review component RTL props

4. **Performance Issues**
   - Implement translation caching
   - Use lazy loading for large files
   - Optimize bundle size

### Getting Help

- **i18next Documentation**: [i18next.com](https://i18next.com)
- **React i18next**: [react.i18next.com](https://react.i18next.com)
- **Community**: GitHub issues and discussions
- **Testing**: Use provided test scripts

## Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Implement fallback languages** for missing translations
3. **Test all supported languages** thoroughly
4. **Use semantic translation keys** for better organization
5. **Implement RTL support** for Hebrew and Arabic
6. **Cache translations** for better performance
7. **Provide context** for translators
8. **Use pluralization** when needed
9. **Test with different locales** and formats
10. **Monitor translation coverage** and completeness

## Conclusion

The WorkNow internationalization system provides a robust, scalable foundation for multilingual support. By following this guide and implementing the best practices, you'll have a production-ready i18n system that serves users in multiple languages while maintaining excellent performance and user experience.
