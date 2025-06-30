import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PremiumButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="btn btn-warning"
      onClick={() => navigate("/premium")}
    >
      <i className="bi bi-gem me-2"></i>
      {t("premium")}
    </button>
  );
};

export default PremiumButton;
