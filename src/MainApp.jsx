import { useMemo, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/clerk-react";
import { baseTheme } from "@clerk/themes";
import { RouterProvider } from "react-router-dom";
import useLanguageStore from "./store/languageStore";
import { HelmetProvider, Helmet } from "react-helmet-async"; // 🔹 SEO
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MyAds from "./pages/MyAds.jsx";
import CreateNewAd from "./pages/CreateNewAd.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import { EditJobForm } from "./components/index.ts";
import UserProfile from "./components/UserProfile.jsx";
import SupportPage from "./components/SupportPage.jsx";
import SurveyWidget from "./components/SurveyWidget.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Seekers from "./pages/Seekers.jsx";
import SeekerDetails from "./pages/SeekerDetails.jsx";
import Inbox from "./pages/Inbox.jsx";
import "./18n.ts";
import "./css/ripple.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/my-advertisements",
    element: <MyAds />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/create-new-advertisement",
    element: (
      <ProtectedRoute>
        <CreateNewAd />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/access-denied",
    element: <AccessDenied />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/edit-job/:id",
    element: (
      <ProtectedRoute>
        <EditJobForm />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/profile/:clerkUserId",
    element: <UserProfile />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/survey",
    element: <SurveyWidget />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/success",
    element: <Success />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/cancel",
    element: <Cancel />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/seekers",
    element: <Seekers />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/seekers/:id",
    element: <SeekerDetails />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/inbox",
    element: <Inbox />,
    errorElement: <NotFoundPage />,
  },
]);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || !PUBLISHABLE_KEY.startsWith('pk_')) {
  // eslint-disable-next-line no-console
  console.error('❌ Ошибка: Некорректный или отсутствует VITE_CLERK_PUBLISHABLE_KEY! Проверьте .env и перезапустите dev-сервер.');
}

const MainApp = () => {
  const localization = useLanguageStore((state) => state.localization);
  const loading = useLanguageStore((state) => state.loading);
  const currentLang = useLanguageStore((state) => state.language) || 'ru';

  const memoizedLocalization = useMemo(() => localization ?? {}, [localization]);

  if (!PUBLISHABLE_KEY || !PUBLISHABLE_KEY.startsWith('pk_')) {
    return <div style={{color: 'red', fontWeight: 'bold', padding: 24}}>❌ Ошибка: Некорректный или отсутствует VITE_CLERK_PUBLISHABLE_KEY!<br/>Проверьте .env и перезапустите dev-сервер.<br/>Текущий ключ: <code>{String(PUBLISHABLE_KEY)}</code></div>;
  }

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
      <div className="ripple">
        <div></div>
        <div></div>
      </div>
    </div>;
  }

  return (
    <ClerkProvider
      appearance={{ baseTheme: baseTheme }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={memoizedLocalization}
      locale={currentLang}
    >
      <HelmetProvider>
        {/* 🔹 Глобальная SEO-оптимизация */}
        <Helmet>
          <title>WorkNow – Работа в Израиле | Поиск вакансий</title>
          <meta name="description" content="Найти работу в Израиле стало проще! Поиск свежих вакансий в Тель-Авиве, Иерусалиме, Хайфе. Начните карьеру с WorkNow!" />
          <meta name="keywords" content="работа в Израиле, вакансии в Израиле, поиск работы Израиль, работа Тель-Авив, работа Хайфа" />
          <meta property="og:title" content="WorkNow – Поиск работы в Израиле" />
          <meta property="og:description" content="Лучшие вакансии в Израиле. Найдите работу мечты в Тель-Авиве, Иерусалиме, Хайфе и других городах!" />
          <meta property="og:url" content="https://worknowjob.com/" />
          <meta property="og:image" content="https://worknowjob.com/images/logo.svg" />
          <meta name="robots" content="index, follow" />

          {/* 🔹 Schema.org (WebSite + Organization) */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "WorkNow",
              "url": "https://worknowjob.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://worknowjob.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })}
          </script>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WorkNow",
              "url": "https://worknowjob.com",
              "logo": "https://worknowjob.com/images/logo.svg",
              "sameAs": [
                "https://www.facebook.com/worknow",
                "https://twitter.com/worknow",
                "https://www.linkedin.com/company/worknow"
              ]
            })}
          </script>
        </Helmet>
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
    </ClerkProvider>
  );
};

export default MainApp;
