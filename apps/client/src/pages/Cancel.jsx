import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useIntlayer } from 'react-intlayer';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL; // Используем переменную окружения

const Cancel = () => {
	const content = useIntlayer('cancelPage');
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		const timeout = setTimeout(() => {
			navigate('/');
		}, 8000);

		return () => clearTimeout(timeout);
	}, [navigate]);

	const handleCheckout = async () => {
		try {
			const response = await axios.post(
				`${API_URL}/api/payments/create-checkout-session`,
				{
					clerkUserId: user.id,
				},
			);

			window.location.href = response.data.url;
			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			toast.error(content.payment_transaction_error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Main Content Container - Ultra-compact for very small screens */}
			<div className="flex-1 flex flex-col items-center justify-center px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-6 lg:py-8">
				{/* Icon and Title Section - Ultra-compact spacing */}
				<div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
					<div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 bg-red-100 rounded-full flex items-center justify-center">
						<span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
							❌
						</span>
					</div>
					<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
						{content.payment_cancelled}
					</h1>
				</div>

				{/* Image Section - Ultra-responsive sizing for very small screens */}
				<div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-sm">
					<img
						className="w-full h-auto mx-auto"
						src={'/images/order-canceled.png'}
						alt="Payment Cancelled"
					/>
				</div>

				{/* Message Section - Ultra-compact for very small screens */}
				<div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-[240px] sm:max-w-[280px] md:max-w-sm lg:max-w-md">
					<p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
						{content.payment_cancelled_description}
					</p>
				</div>

				{/* Action Button - Ultra-responsive sizing for very small screens */}
				<div className="w-full max-w-[160px] sm:max-w-[200px] md:max-w-sm mb-2 sm:mb-3 md:mb-4 lg:mb-6">
					<button
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 lg:py-4 px-3 sm:px-4 md:px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base"
						onClick={handleCheckout}
					>
						{content.try_again}
					</button>
				</div>

				{/* Auto-redirect Info - Ultra-compact for very small screens */}
				<div className="text-center">
					<p className="text-xs text-gray-500">{content.redirecting_soon}</p>
				</div>
			</div>
		</div>
	);
};

export default Cancel;
