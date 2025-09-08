import { useIntlayer } from "react-intlayer";
import { useNavigate } from "react-router-dom";

const PremiumButton = () => {
  const content = useIntlayer("premiumButton");
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="btn btn-warning"
      onClick={() => navigate("/premium")}
    >
      <i className="bi bi-gem me-2"></i>
      {content.premium.value}
    </button>
  );
};

export default PremiumButton;
