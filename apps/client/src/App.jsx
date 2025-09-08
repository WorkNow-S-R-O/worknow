import { useMemo, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/clerk-react";
import { baseTheme } from "@clerk/themes";
import { ruRU, enUS, heIL, arSA, ukUA } from "@clerk/localizations";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async"; // 🔹 SEO
import { ImageUploadProvider } from "./contexts/ImageUploadContext.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { IntlayerProvider, useIntlayer, useLocale } from "react-intlayer";
import { useI18nHTMLAttributes } from "./hooks/useI18nHTMLAttributes";
import ProgressBar from "./components/ui/ProgressBar.jsx";
import Home from "./pages/Home.jsx";
import MyAds from "./pages/MyAds.jsx";
import CreateNewAd from "./pages/CreateNewAd.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import { EditJobForm } from "./components/form/EditJobForm.jsx";
import UserProfile from "./components/UserProfile.jsx";
import SupportPage from "./components/SupportPage.jsx";
import SurveyWidget from "./components/SurveyWidget.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Seekers from "./pages/Seekers.jsx";
import SeekerDetails from "./pages/SeekerDetails.jsx";
import PremiumPage from "./components/PremiumPage.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import "./css/ripple.css";
import CancelSubscription from "./components/CancelSubscription.jsx";
import BillingPage from "./components/BillingPage.jsx";
import NewsletterSubscription from "./pages/NewsletterSubscription.jsx";

// Google Analytics Configuration
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        dimension1: 'user_type',
        dimension2: 'subscription_status'
      }
    });
  }
};

// Track page views
const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: document.title
    });
  }
};

function Layout() {
  // Track page views when route changes
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Корневой layout с Navbar/Footer
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "my-advertisements", element: <MyAds /> },
      { path: "create-new-advertisement", element: <ProtectedRoute><CreateNewAd /></ProtectedRoute> },
      { path: "access-denied", element: <AccessDenied /> },
      { path: "edit-job/:id", element: <ProtectedRoute><EditJobForm /></ProtectedRoute> },
      { path: "profile/:clerkUserId", element: <UserProfile /> },
      { path: "support", element: <SupportPage /> },
      { path: "survey", element: <SurveyWidget /> },
      { path: "success", element: <Success /> },
      { path: "cancel", element: <Cancel /> },
      { path: "seekers", element: <Seekers /> },
      { path: "seekers/:id", element: <SeekerDetails /> },
      { path: "premium", element: <PremiumPage /> },
      { path: "cancel-subscription", element: <CancelSubscription /> },
      { path: "billing", element: <BillingPage /> },
      { path: "newsletter", element: <NewsletterSubscription /> },
      { path: "*", element: <NotFoundPage /> },
    ]
  }
]);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || !PUBLISHABLE_KEY.startsWith('pk_')) {
  // eslint-disable-next-line no-console
  console.error('❌ Ошибка: Некорректный или отсутствует VITE_CLERK_PUBLISHABLE_KEY! Проверьте .env и перезапустите dev-сервер.');
}

// Clerk localization mapping
const clerkLocalizationMap = {
  'ru': ruRU,
  'en': enUS,
  'he': heIL,
  'ar': arSA,
  'uk': ukUA,
};

const AppContent = () => {
  const { locale } = useLocale();
  
  // Apply the hook to update the <html> tag's lang and dir attributes based on the locale.
  useI18nHTMLAttributes();
  
  // Get the appropriate Clerk localization based on current locale
  const clerkLocalization = clerkLocalizationMap[locale] || ruRU; // Default to Russian

  // Initialize Google Analytics on app load
  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);

    // Track initial page view
    initGA();

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  if (!PUBLISHABLE_KEY || !PUBLISHABLE_KEY.startsWith('pk_')) {
    return <div style={{color: 'red', fontWeight: 'bold', padding: 24}}>❌ Ошибка: Некорректный или отсутствует VITE_CLERK_PUBLISHABLE_KEY!<br/>Проверьте .env и перезапустите dev-сервер.<br/>Текущий ключ: <code>{String(PUBLISHABLE_KEY)}</code></div>;
  }

  return (
    <ClerkProvider
      appearance={{ baseTheme: baseTheme }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={clerkLocalization}
    >
      <LoadingProvider>
        <ImageUploadProvider>
          <HelmetProvider>
          {/* 🔹 Глобальная SEO-оптимизация */}
          <Helmet>
              <title>WorkNow – Работа в Израиле | Поиск вакансий</title>
              <meta name="description" content="Найти работу в Израиле стало проще! Поиск свежих вакансий в Тель-Авиве, Иерусалиме, Хайфе. Начните карьеру с WorkNow!" />
              <meta name="keywords" content="работа в Израиле, вакансии в Израиле, поиск работы Израиль, работа Тель-Авив, работа Хайфа" />
              <meta property="og:title" content="WorkNow – Поиск работы в Израиле" />
              <meta property="og:description" content="Лучшие вакансии в Израиле. Найдите работу мечты в Тель-Авиве, Иерусалиме, Хайфе и других городах!" />
              <meta property="og:url" content="https://worknow.co.il/" />
              <meta property="og:image" content="https://worknow.co.il/images/logo.svg" />
              <meta name="robots" content="index, follow" />

              {/* Google Analytics */}
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
              <script>
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    custom_map: {
                      dimension1: 'user_type',
                      dimension2: 'subscription_status'
                    }
                  });
                `}
              </script>

              {/* 🔹 Schema.org (WebSite + Organization) */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "WorkNow",
                  "url": "https://worknow.co.il",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://worknow.co.il/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                })}
              </script>
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "WorkNow",
                  "url": "https://worknow.co.il",
                  "logo": "https://worknow.co.il/images/logo.svg",
                  "sameAs": [
                    "https://www.facebook.com/worknow",
                    "https://twitter.com/worknow",
                    "https://www.linkedin.com/company/worknow"
                  ]
                })}
              </script>
            </Helmet>
            <ProgressBar />
            <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
              <div className="ripple">
                <div></div>
                <div></div>
              </div>
            </div>}>
              <RouterProvider router={router} />
            </Suspense>
            <Toaster position="top-center" />
          </HelmetProvider>
        </ImageUploadProvider>
      </LoadingProvider>
    </ClerkProvider>
  );
};

const App = () => {
  return (
    <IntlayerProvider>
      <AppContent />
    </IntlayerProvider>
  );
};

export default App;
