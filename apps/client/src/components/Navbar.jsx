import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { useLanguageManager } from "../hooks/useLanguageManager";
import PremiumButton from "./ui/premium-button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import MailDropdown from "./ui/MailDropdown";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Navbar = () => {
  const content = useIntlayer("navbar");
  const { locale } = useLocale();
  const { changeLanguage, isLoading, clearLanguagePreference } = useLanguageManager();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);

  // Close mobile navbar when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  // Expose functions to window for testing
  useEffect(() => {
    window.resetLanguageDetection = clearLanguagePreference;
    window.testLanguageLoading = () => {
      console.log('🧪 Language Loading Test');
      console.log('Current locale:', locale);
      console.log('Is loading:', isLoading);
      console.log('Available languages:', ['ru', 'en', 'he', 'ar', 'uk']);
      console.log('Cookie value:', document.cookie);
      console.log('LocalStorage value:', localStorage.getItem('worknow-language'));
    };
  }, [clearLanguagePreference, locale, isLoading]);

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
                {content.vacancies.value}
              </Link>
            </li>
            <span className="nav-slash">/</span>
            <li className="mr-3">
              <Link id="seekers" to="/seekers" className="nav-link text-base font-normal">
                {content.seekers.value}
              </Link>
            </li>
            <span className="nav-slash">/</span>
            <li className="mr-3">
              <Link id="jobs" to="/my-advertisements" className="nav-link text-base font-normal">
                {content.jobs.value}
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
                {content.support.value}
              </button>
              <ul id="supportDropdown" className="dropdown-menu mt-3 text-gray-600 " aria-labelledby="supportDropdown">
                <li>
                  <a 
                    href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca" 
                    className="dropdown-item" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {content.rules.value}
                  </a>
                </li>
                <li>
                  <Link to="/support" className="dropdown-item">
                    {content.technicalSupport.value}
                  </Link>
                </li>
                <li>
                  <Link to="/billing" className="dropdown-item">
                    {content.billing.value}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center absolute top-0 right-0 m-3">
          <SignedIn>
            <MailDropdown />
          </SignedIn>
          <div className="dropdown me-2">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-translate me-2"></i>
              {locale === "en" ? content.languageNames.en.value : locale === "he" ? content.languageNames.he.value : locale === "ar" ? content.languageNames.ar.value : locale === "uk" ? content.languageNames.uk.value : content.languageNames.ru.value}
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <button 
                  onClick={() => changeLanguage("en")} 
                  className="dropdown-item"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : ''} {content.languageNames.en.value}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => changeLanguage("ru")} 
                  className="dropdown-item"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : ''} {content.languageNames.ru.value}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => changeLanguage("he")} 
                  className="dropdown-item"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : ''} {content.languageNames.he.value}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => changeLanguage("ar")} 
                  className="dropdown-item"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : ''} {content.languageNames.ar.value}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => changeLanguage("uk")} 
                  className="dropdown-item"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳' : ''} {content.languageNames.uk.value}
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
                  {content.signIn.value}
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
                  {content.vacancies.value}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-lg font-normal" to="/seekers">
                  {content.seekers.value}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-lg font-normal" to="/my-advertisements">
                  {content.jobs.value}
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
                  {content.support.value}
                </button>
                <ul className="dropdown-menu" aria-labelledby="mobileSupportDropdown">
                  <li>
                    <a 
                      href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca" 
                      className="dropdown-item" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {content.rules.value}
                    </a>
                  </li>
                  <li>
                    <Link to="/support" className="dropdown-item">
                      {content.technicalSupport.value}
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
                  {locale === "en" ? content.languageNames.en.value : locale === "he" ? content.languageNames.he.value : locale === "ar" ? content.languageNames.ar.value : locale === "uk" ? content.languageNames.uk.value : content.languageNames.ru.value}
                </button>
                <ul className="dropdown-menu w-100" aria-labelledby="mobileLanguageDropdown">
                  <li>
                    <button 
                      onClick={() => changeLanguage("en")} 
                      className="dropdown-item"
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳' : ''} {content.languageNames.en.value}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => changeLanguage("ru")} 
                      className="dropdown-item"
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳' : ''} {content.languageNames.ru.value}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => changeLanguage("he")} 
                      className="dropdown-item"
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳' : ''} {content.languageNames.he.value}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => changeLanguage("ar")} 
                      className="dropdown-item"
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳' : ''} {content.languageNames.ar.value}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => changeLanguage("uk")} 
                      className="dropdown-item"
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳' : ''} {content.languageNames.uk.value}
                    </button>
                  </li>
                </ul>
              </div>
              <SignedOut>
                <SignInButton>
                  <span className="btn btn-primary d-flex align-items-center justify-content-center">
                    <i className="bi bi-person-circle me-2"></i>
                    {content.signIn.value}
                  </span>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <PremiumButton />
              <SignedIn>
                <MailDropdown />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export { Navbar };
