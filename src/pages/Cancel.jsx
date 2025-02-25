import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";

const Cancel = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
        navigate('/');
      }, 5000);

      return () => clearTimeout(timeout);
  }, [navigate]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/payments/create-checkout-session', {
        clerkUserId: user.id,
      });

      window.location.href = response.data.url;
    } catch (error) {
      toast.error(t("payment_transaction_error"));
    }
  };

  return (
    <div className="text-center p-4">
      <h2>{t("payment_cancelled")} ❌</h2>
      <p>{t("payment_cancelled_description")}</p>
      <button 
        className="btn btn-primary mt-4"
        onClick={handleCheckout}
      >
        {t("try_again")}
      </button>
    </div>
  );
};

export default Cancel;
