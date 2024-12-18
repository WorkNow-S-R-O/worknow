import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Установка языка при загрузке на основе URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlLanguage = searchParams.get("lng");

    if (urlLanguage && urlLanguage !== i18n.language) {
      i18n.changeLanguage(urlLanguage);
    } else if (!urlLanguage) {
      // Если языка нет в URL, добавляем текущий язык
      searchParams.set("lng", i18n.language);
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, [location.search, i18n, navigate, location.pathname]);

  const changeLanguage = (language) => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);

      const searchParams = new URLSearchParams(location.search);
      searchParams.set("lng", language);
      navigate(`${location.pathname}?${searchParams.toString()}`);
    }
  };

  return { changeLanguage };
};
