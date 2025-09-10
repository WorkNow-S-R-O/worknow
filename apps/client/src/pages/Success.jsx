import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import { useIntlayer } from 'react-intlayer';

const API_URL = import.meta.env.VITE_API_URL; // Используем переменную окружения

const Success = () => {
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get('session_id');
	const navigate = useNavigate();
	const { user } = useUser();
	const content = useIntlayer('successPage');

	useEffect(() => {
		const activatePremium = async () => {
			try {
				const response = await axios.post(
					`${API_URL}/api/payments/activate-premium`,
					{
						sessionId,
						clerkUserId: user.id,
					},
				);

				toast.success(content.premiumActivated.value);
				navigate('/premium?fromSuccess=true');
			} catch (error) {
				toast.error(content.activationError.value);
			}
		};

		if (sessionId && user) {
			activatePremium();
		}
	}, [sessionId, user, navigate]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
			{/* Main Content Container - Compact for small screens */}
			<div className="flex-1 flex flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-6 md:py-8">
				{/* Success Icon and Title Section - Compact spacing */}
				<div className="text-center mb-4 sm:mb-6 md:mb-8">
					<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
						{content.title.value}
					</h1>
					<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
						{content.subtitle.value}
					</p>
				</div>

				{/* Success Illustration - Responsive sizing for small screens */}
				<div className="mb-4 sm:mb-6 md:mb-8 w-full max-w-[160px] sm:max-w-[200px] md:max-w-sm">
					<img
						className="w-full h-auto mx-auto drop-shadow-lg"
						src={'/images/success.png'}
						alt="Payment Success"
					/>
				</div>

				{/* Status Message - Compact for small screens */}
				<div className="text-center mb-4 sm:mb-6 md:mb-8 max-w-[280px] sm:max-w-sm md:max-w-md">
					<div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-lg border border-blue-200">
						<div className="flex items-center justify-center mb-2 sm:mb-3">
							<div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
							<span className="text-xs sm:text-sm font-medium text-blue-700">
								{content.processing.value}
							</span>
						</div>
						<p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
							{content.waitMessage.value}
						</p>
					</div>
				</div>

				{/* Loading Animation - Blue Style - Compact for small screens */}
				<div className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
					<div className="flex space-x-1.5 sm:space-x-2">
						<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"></div>
						<div
							className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
							style={{ animationDelay: '0.1s' }}
						></div>
						<div
							className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
							style={{ animationDelay: '0.2s' }}
						></div>
					</div>
				</div>

				{/* Redirect Info - Compact for small screens */}
				<div className="text-center">
					<p className="text-xs sm:text-sm text-gray-500">
						{content.redirecting.value}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Success;
