import { useMemo } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import useLanguageStore from "./store/languageStore";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MyAds from "./pages/MyAds.jsx";
import CreateNewAd from "./pages/CreateNewAd.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
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
    element: <CreateNewAd />,
    errorElement: <NotFoundPage />,
  },
]);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const MainApp = () => {
  const localization = useLanguageStore((state) => state.localization);

  const memoizedLocalization = useMemo(() => localization, [localization]);

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={memoizedLocalization}
    >
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </ClerkProvider>
  );
};

export default MainApp;
