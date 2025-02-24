import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const activatePremium = async () => {
      try {
        await axios.post('http://localhost:3001/api/payments/activate-premium', {
          sessionId,
          clerkUserId: user.id,
        });

        toast.success('🎉 Premium активирован!');
        navigate('/');
      } catch (error) {
        toast.error('Ошибка активации Premium');
        console.error(error);
      }
    };

    if (sessionId && user) {
      activatePremium();
    }
  }, [sessionId, user, navigate]);

  return (
    <div className="text-center p-4">
      <h2>Оплата прошла успешно! 🎉</h2>
      <p>Активируем ваш Premium-статус...</p>
    </div>
  );
};

export default Success;
