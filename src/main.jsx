import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./pages/App.jsx";

import './18n.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
