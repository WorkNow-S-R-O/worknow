/* eslint-disable no-unused-vars */
import { useUser } from "@clerk/clerk-react";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useIntlayer } from "react-intlayer";

const API_URL = import.meta.env.VITE_API_URL;

const CancelSubscription = () => {
  const content = useIntlayer("cancelSubscription");
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(null);
  const [isAutoRenewal, setIsAutoRenewal] = useState(null);
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState("");

  // Получаем статус премиума и автопродления с сервера
  const fetchUserStatus = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/api/users/${user.id}`);
      setIsPremium(res.data.isPremium);
      setIsAutoRenewal(res.data.isAutoRenewal);
    } catch {
      setIsPremium(false);
      setIsAutoRenewal(false);
    }
  };

  useEffect(() => {
    fetchUserStatus();
    // eslint-disable-next-line
  }, [user]);

  const handleCancel = async () => {
    if (!user || !isPremium || !isAutoRenewal) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/api/payments/cancel-auto-renewal`, {
        clerkUserId: user.id,
      });
      await fetchUserStatus();
    } catch (e) {
      setError(content.error_cancel_subscription);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!user) return;
    setRenewLoading(true);
    setRenewError("");
    try {
      await axios.post(`${API_URL}/api/payments/renew-auto-renewal`, {
        clerkUserId: user.id,
      });
      await fetchUserStatus();
    } catch (e) {
      setRenewError(content.error_renew_subscription);
    } finally {
      setRenewLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, margin: '0 auto', paddingTop: 60 }}>
      <h2 className="text-center mb-4">{content.cancel_subscription_title}</h2>
      {!user ? (
        <div className="alert alert-info text-center" style={{ background: '#d1f3fa' }}>
          {content.no_active_subscription}{' '}
          <button
            className="btn btn-primary ms-2"
            onClick={() => redirectToSignIn()}
            type="button"
          >
            {content.sign_in_to_account}
          </button>
        </div>
      ) : (
        <>
          {isPremium && isAutoRenewal === false && (
            <div className="alert alert-success text-center mb-4">{content.auto_renewal_disabled}</div>
          )}
          {isPremium && isAutoRenewal === false && (
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleRenew}
              disabled={renewLoading}
            >
              {renewLoading ? content.enable_loading : content.renew_subscription}
            </button>
          )}
          {renewError && <div className="alert alert-danger text-center mb-3">{renewError}</div>}
          {isPremium && isAutoRenewal && (
            <>
              <p className="mb-4 text-center">{content.confirm_cancel_auto_renewal}</p>
              <button
                className="btn btn-danger w-100"
                onClick={handleCancel}
                disabled={loading || !user || !isPremium}
              >
                {loading ? content.cancel_loading : content.cancel_subscription_button}
              </button>
              {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
            </>
          )}
          {!isPremium && isPremium !== null && (
            <div className="alert alert-info mt-3 text-center">{content.no_premium_subscription}</div>
          )}
        </>
      )}
    </div>
  );
};

export default CancelSubscription; 