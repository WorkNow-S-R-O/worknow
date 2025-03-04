import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PremiumButton from "./ui/premium-button";
import useLanguageStore from "../store/languageStore"; // Импортируем Zustand хранилище
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!PUBLISHABLE_KEY || !googleClientId) {
  console.error("❌ Clerk API Key или Google Client ID не найдены!");
}

const Navbar = () => {
  const { t, i18n } = useTranslation();

  // Используем отдельные селекторы для language и changeLanguage
  const language = useLanguageStore((state) => state.language);
  const changeLanguage = useLanguageStore((state) => state.changeLanguage);

  const [isExpanded, setIsExpanded] = useState(false);

  // Обработчик смены языка
  const handleLanguageChange = (lang) => {
    changeLanguage(lang); // Обновляем Zustand хранилище
    i18n.changeLanguage(lang); // Обновляем i18n
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="d-none d-lg-block mb-10">
        <div className="absolute top-0 left-0 w-full h-16 bg-[#e3f2fd]"></div>
        <div className="flex absolute top-0 left-0 m-3">
          <Link to="/" className="d-flex align-items-center no-underline text-black">
            <img className="w-12 bottom-2 relative ml-0 me-2" src="/images/logo.svg" alt="Logo" />
            <h1 className="text-3xl ml-0">worknow</h1>
          </Link>
          <ul className="flex justify-center items-center ml-0 gap-2 mb-2 text-gray-500">
            <li className="mr-3">
              <Link id="vacancies" to="/" className="nav-link text-lg font-normal text-gray-600 hover:text-gray-900">
                {t("vacancies")}
              </Link>
            </li>
            <li className="mr-3">
              <Link id="jobs" to="/my-advertisements" className="nav-link text-lg font-normal text-gray-600 focus:text-black">
                {t("jobs")}
              </Link>
            </li>
            {/* Dropdown Support */}
            <li className="nav-item dropdown">
              <button
                className="nav-link text-lg font-normal text-gray-600 focus:text-gray-900 dropdown-toggle"
                type="button"
                id="supportDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {t("support")}
              </button>
              <ul id="supportDropdown" className="dropdown-menu mt-3 text-gray-600 " aria-labelledby="supportDropdown">
                <li>
                  <Link to="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca" className="dropdown-item text-gray-600">
                    {t("rules")}
                  </Link>
                </li>
                <li>
                  <Link to="/technical-support" className="dropdown-item">
                    {t("technical_support")}
                  </Link>
                </li>
                <li>
                  <Link to="/survey" className="dropdown-item">
                    {t("survey")}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center absolute top-0 right-0 m-3">
          <div className="dropdown me-2">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-translate me-2"></i>
              {language === "en" ? "English" : "Russian"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <button onClick={() => handleLanguageChange("en")} className="dropdown-item">
                  English
                </button>
              </li>
              <li>
                <button onClick={() => handleLanguageChange("ru")} className="dropdown-item">
                  Russian
                </button>
              </li>
            </ul>
          </div>
          <PremiumButton />
          <div className="d-flex ml-5">
            <SignedOut>
              <SignInButton>
                <span className="btn btn-primary d-flex align-items-center">
                  <i className="bi bi-person-circle me-2"></i>
                  {t("signin")}
                </span>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <nav className="z-10 navbar navbar-expand-lg navbar-light bg-[#e3f2fd] d-lg-none fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img className="w-12 me-2" src="/images/logo.svg" alt="Logo" />
            <h1 className="text-3xl m-0">worknow</h1>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-controls="navbarNav"
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${isExpanded ? "show" : "collapse"}`} id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-lg font-normal text-gray-600 hover:text-gray-900" to="/">
                  {t("vacancies")}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-lg font-normal text-gray-600 hover:text-gray-900" to="/my-advertisements">
                  {t("jobs")}
                </Link>
              </li>
              {/* Dropdown Support */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link text-lg font-normal text-gray-600 hover:text-gray-900 dropdown-toggle"
                  type="button"
                  id="mobileSupportDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t("support")}
                </button>
                <ul className="dropdown-menu" aria-labelledby="mobileSupportDropdown">
                  <li>
                    <Link to="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca" className="dropdown-item">
                      {t("rules")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/technical-support" className="dropdown-item">
                      {t("technical_support")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/survey" className="dropdown-item">
                      {t("survey")}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            <div className="d-flex flex-column gap-2 mt-3">
              <SignedOut>
                <SignInButton>
                  <span className="btn btn-primary d-flex align-items-center justify-content-center">
                    <i className="bi bi-person-circle me-2"></i>
                    {t("signin")}
                  </span>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <PremiumButton />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export { Navbar };
