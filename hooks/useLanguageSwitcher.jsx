import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("lng", language);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return { changeLanguage };
};
