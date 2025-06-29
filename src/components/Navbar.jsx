import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PremiumButton from "./ui/premium-button";
import useLanguageStore from "../store/languageStore"; // Импортируем Zustand хранилище
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import MailDropdown from "./ui/MailDropdown";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_URL = import.meta.env.VITE_API_URL;

if (!PUBLISHABLE_KEY || !googleClientId) {
  console.error("❌ Clerk API Key или Google Client ID не найдены!");
}

const Navbar = () => {
  const { t, i18n } = useTranslation();

  // Используем отдельные селекторы для language и changeLanguage
  const language = useLanguageStore((state) => state.language);
  const changeLanguage = useLanguageStore((state) => state.changeLanguage);

  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUser();

  // Обработчик смены языка
  const handleLanguageChange = (lang) => {
    changeLanguage(lang); // Обновляем Zustand хранилище
    i18n.changeLanguage(lang); // Обновляем i18n
  };

  // Polling на новые письма + toast
  useEffect(() => {
    if (!user) return;
    let timer;
    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages?userId=${user.id}`);
        const msgs = res.data.messages || [];
        const count = msgs.filter(m => !m.isRead).length;
        if (count > 0) {
          toast((t) => (
            <span>
              📩 Новое сообщение!{' '}
              <button className="btn btn-link p-0 m-0 align-baseline" style={{color:'#1976d2',textDecoration:'underline'}} onClick={() => { window.location.href = '/inbox'; toast.dismiss(t.id); }}>Перейти во входящие</button>
            </span>
          ), { id: 'new-mail', duration: 7000 });
        }
      } catch {}
    };
    fetchUnread();
    timer = setInterval(fetchUnread, 30000); // каждые 30 сек
    return () => clearInterval(timer);
  }, [user]);

  return (
    <>
      {/* Desktop Version */}
      <div className="d-none d-lg-block mb-10">
        <div className="absolute top-0 left-0 w-full h-16 bg-[#e3f2fd]"></div>
        <div className="flex absolute top-0 left-0 m-3 items-center">
          <div className="logo-container">
            <Link to="/" className="d-flex align-items-center no-underline text-black p-0 m-0" style={{gap: '6px'}}>
              <img className="logo-img" src="/images/logo.svg" alt="Logo" />
              <h1 className="logo-text">worknow</h1>
            </Link>
          </div>
          <ul className="flex justify-center items-center ml-0 gap-2 mb-2 text-gray-500">
            <li className="mr-3">
              <Link id="vacancies" to="/" className="nav-link text-base font-normal">
                {t("vacancies")}
              </Link>
            </li>
            <span className="nav-slash">/</span>
            <li className="mr-3">
              <Link id="seekers" to="/seekers" className="nav-link text-base font-normal">
                {t("seekers")}
              </Link>
            </li>
            <span className="nav-slash">/</span>
            <li className="mr-3">
              <Link id="jobs" to="/my-advertisements" className="nav-link text-base font-normal">
                {t("jobs")}
              </Link>
            </li>
            {/* Dropdown Support */}
            <span className="nav-slash">/</span>
            <li className="nav-item dropdown">
              <button
                className="nav-link text-base font-normal dropdown-toggle"
                type="button"
                id="supportDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {t("support")}
              </button>
              <ul id="supportDropdown" className="dropdown-menu mt-3 text-gray-600 " aria-labelledby="supportDropdown">
                <li>
                  <a 
                    href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca" 
                    className="dropdown-item" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {t("rules")}
                  </a>
                </li>
                <li>
                  <Link to="/support" className="dropdown-item">
                    {t("technical_support")}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center absolute top-0 right-0 m-3">
          <MailDropdown />
          <div className="dropdown me-2">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-translate me-2"></i>
              {language === "en" ? "English" : language === "he" ? "עברית" : "Русский"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <button onClick={() => handleLanguageChange("en")} className="dropdown-item">
                  English
                </button>
              </li>
              <li>
                <button onClick={() => handleLanguageChange("ru")} className="dropdown-item">
                  Русский
                </button>
              </li>
              <li>
                <button onClick={() => handleLanguageChange("he")} className="dropdown-item">
                  עברית
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
                <Link className="nav-link text-lg font-normal" to="/">
                  {t("vacancies")}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-lg font-normal" to="/seekers">
                  {t("seekers")}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-lg font-normal" to="/my-advertisements">
                  {t("jobs")}
                </Link>
              </li>
              {/* Dropdown Support */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link text-lg font-normal dropdown-toggle"
                  type="button"
                  id="mobileSupportDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t("support")}
                </button>
                <ul className="dropdown-menu" aria-labelledby="mobileSupportDropdown">
                  <li>
                    <a 
                      href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca" 
                      className="dropdown-item" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {t("rules")}
                    </a>
                  </li>
                  <li>
                    <Link to="/support" className="dropdown-item">
                      {t("technical_support")}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            <div className="d-flex flex-column gap-2 mt-3">
              <div className="dropdown mb-2">
                <button
                  className="btn btn-secondary dropdown-toggle w-100"
                  type="button"
                  id="mobileLanguageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-translate me-2"></i>
                  {language === "en" ? "English" : language === "he" ? "עברית" : "Русский"}
                </button>
                <ul className="dropdown-menu w-100" aria-labelledby="mobileLanguageDropdown">
                  <li>
                    <button onClick={() => handleLanguageChange("en") } className="dropdown-item">English</button>
                  </li>
                  <li>
                    <button onClick={() => handleLanguageChange("ru") } className="dropdown-item">Русский</button>
                  </li>
                  <li>
                    <button onClick={() => handleLanguageChange("he") } className="dropdown-item">עברית</button>
                  </li>
                </ul>
              </div>
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
              <MailDropdown />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export { Navbar };
