import { useMemo, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/clerk-react";
import { baseTheme } from "@clerk/themes";
import { RouterProvider } from "react-router-dom";
import useLanguageStore from "./store/languageStore";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MyAds from "./pages/MyAds.jsx";
import CreateNewAd from "./pages/CreateNewAd.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import EditJobForm from "./components/EditJobForm.jsx";
import UserProfile from "./components/UserProfile.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import "./18n.ts";

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
    path: "/success",
    element: <Success />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/cancel",
    element: <Cancel />,
    errorElement: <NotFoundPage />,
  },
]);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const MainApp = () => {
  const localization = useLanguageStore((state) => state.localization);
  const loading = useLanguageStore((state) => state.loading); // Добавляем проверку загрузки

  const memoizedLocalization = useMemo(() => localization ?? {}, [localization]);

  // 1️⃣ Если PUBLISHABLE_KEY отсутствует, рендерим заглушку вместо ошибки
  if (!PUBLISHABLE_KEY) {
    return <div>❌ Ошибка: Ключ Clerk отсутствует</div>;
  }

  // 2️⃣ Пока загрузка локализации идет — показываем заглушку
  if (loading) {
    return <div>🔄 Загрузка переводов...</div>;
  }

  return (
    <ClerkProvider
      appearance={{ baseTheme: baseTheme }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={memoizedLocalization}
    >
      <HelmetProvider>
        <Suspense fallback={<div>🔄 Загрузка страницы...</div>}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster position="top-center" />
      </HelmetProvider>
    </ClerkProvider>
  );
};

export default MainApp;
