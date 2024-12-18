import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./pages/App.jsx";

import "./18n.js";
import { ruRU } from "@clerk/localizations";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={ruRU}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
