import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const Button = () => {
  const { t } = useTranslation();

  return (
    <Link to="/create-new-advertisement">
      <div>
        <button className="btn btn-primary h-16 flex fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto">
          <i className="bi bi-plus-circle-fill me-2 text-xl"></i>
          {t("button_create_new_advertisement")}
        </button>
      </div>
    </Link>
  );
};

export { Button };
