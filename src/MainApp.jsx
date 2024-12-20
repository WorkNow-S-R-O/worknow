import { useMemo } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import useLanguageStore from "./store/languageStore";
import { createBrowserRouter } from "react-router-dom";
import App from "./pages/App.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./18n.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
      <RouterProvider router={router} />
    </ClerkProvider>
  );
};

export default MainApp;
