import { StrictMode, useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./pages/App.jsx";
import "./18n.ts";
import { ruRU } from "@clerk/localizations";
import { enUS } from "@clerk/localizations";

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

const LanguageContext = createContext();

const MainApp = () => {
  const savedLang = localStorage.getItem("language") || "ru";
  const initialLocalization = savedLang === "en" ? enUS : ruRU;
  const [localization, setLocalization] = useState(initialLocalization);

  const changeClerkLanguage = (lang) => {
    switch (lang) {
      case "en":
        setLocalization(enUS);
        localStorage.setItem("language", "en");
        break;
      case "ru":
        setLocalization(ruRU);
        localStorage.setItem("language", "ru");
        break;
      default:
        setLocalization(enUS);
        localStorage.setItem("language", "en");
    }
  };

  return (
    <LanguageContext.Provider value={{ changeClerkLanguage }}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        localization={localization}
      >
        <RouterProvider router={router} />
      </ClerkProvider>
    </LanguageContext.Provider>
  );
};

// Рендер основного приложения
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);

export { LanguageContext };
