import { useIntlayer } from 'react-intlayer';
import {
	Mail,
	Phone,
	MessageCircle,
	Clock,
	HelpCircle,
	Users,
	Shield,
	Zap,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SupportPage = () => {
	const content = useIntlayer('supportPage');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const modalRef = useRef();

	// Determine if mobile
	const isMobile = window.innerWidth <= 768;
	const minSwipeDistance = 50;

	const supportMethods = [
		{
			icon: Mail,
			title: content.support_email_title,
			description: content.support_email_description,
			contact: 'worknow.notifications@gmail.com',
			action: 'mailto:worknow.notifications@gmail.com',
			color: 'bg-blue-500',
			hoverColor: 'hover:bg-blue-600',
		},
		{
			icon: MessageCircle,
			title: content.support_live_chat_title,
			description: content.support_live_chat_description,
			contact: content.support_available_24_7,
			action: '#',
			color: 'bg-green-500',
			hoverColor: 'hover:bg-green-600',
			disabled: true,
		},
		{
			icon: Phone,
			title: content.support_phone_title,
			description: content.support_phone_description,
			contact: '+972-053-3033332',
			action: 'tel:+972-053-3033332',
			color: 'bg-purple-500',
			hoverColor: 'hover:bg-purple-600',
		},
	];

	const faqItems = [
		{
			question: content.support_faq_create_job_question,
			answer: content.support_faq_create_job_answer,
		},
		{
			question: content.support_faq_premium_question,
			answer: content.support_faq_premium_answer,
		},
		{
			question: content.support_faq_edit_job_question,
			answer: content.support_faq_edit_job_answer,
		},
		{
			question: content.support_faq_contact_seekers_question,
			answer: content.support_faq_contact_seekers_answer,
		},
		{
			question: content.support_faq_job_limits_question,
			answer: content.support_faq_job_limits_answer,
		},
		{
			question: content.support_faq_payment_question,
			answer: content.support_faq_payment_answer,
		},
		{
			question: content.support_faq_categories_question,
			answer: content.support_faq_categories_answer,
		},
		{
			question: content.support_faq_cities_question,
			answer: content.support_faq_cities_answer,
		},
	];

	const features = [
		{
			icon: Shield,
			title: content.support_secure_platform_title,
			description: content.support_secure_platform_description,
		},
		{
			icon: Zap,
			title: content.support_fast_reliable_title,
			description: content.support_fast_reliable_description,
		},
		{
			icon: Users,
			title: content.support_community_driven_title,
			description: content.support_community_driven_description,
		},
	];

	// Touch handlers for mobile modal
	const onTouchStart = (e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientY);
	};

	const onTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientY);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isUpSwipe = distance > minSwipeDistance;

		if (isUpSwipe) {
			closeModal();
		}
	};

	const openModal = (method) => {
		setSelectedMethod(method);
		setIsModalOpen(true);
		document.body.style.overflow = 'hidden';
		if (isMobile) {
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedMethod(null);
		document.body.style.overflow = '';
		if (isMobile) {
			document.body.style.position = '';
			document.body.style.width = '';
		}
	};

	const handleContactClick = (method) => {
		if (isMobile) {
			openModal(method);
		} else {
			// Desktop behavior - direct action
			if (!method.disabled) {
				window.open(method.action, '_blank');
			}
		}
	};

	useEffect(() => {
		return () => {
			document.body.style.overflow = '';
			if (isMobile) {
				document.body.style.position = '';
				document.body.style.width = '';
			}
		};
	}, [isMobile]);

	const modalStyle = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		background: 'rgba(0,0,0,0.3)',
		zIndex: 1000,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};

	const contentStyle = {
		background: '#fff',
		borderRadius: 0,
		height: '100vh',
		width: '100vw',
		padding: '16px 16px',
		display: 'flex',
		flexDirection: 'column',
		boxShadow: 'none',
		border: 'none',
		position: 'absolute',
		top: 0,
		left: 0,
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-12 sm:mt-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="text-center">
						<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-6">
							<HelpCircle className="h-8 w-8 text-white" />
						</div>
						<h1 className="text-4xl font-bold mb-4">
							{content.technical_support}
						</h1>
						<p className="text-xl text-blue-100 max-w-2xl mx-auto">
							{content.support_hero_description}
						</p>
					</div>
				</div>
			</div>

			{/* Support Methods */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						{content.support_get_in_touch}
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						{content.support_get_in_touch_description}
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mb-16 mt-8 sm:mt-12">
					{supportMethods.map((method, index) => (
						<div
							key={index}
							className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
								method.disabled ? 'opacity-60' : ''
							}`}
						>
							<div className="p-8 text-center">
								<div
									className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${method.color} ${method.hoverColor} transition-colors duration-200 mb-6`}
								>
									<method.icon className="h-8 w-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{method.title}
								</h3>
								<p className="text-gray-600 mb-4">{method.description}</p>
								<div className="space-y-2">
									<p className="text-sm text-gray-500">{method.contact}</p>
									{!method.disabled ? (
										<button
											onClick={() => handleContactClick(method)}
											className={`inline-flex items-center px-6 py-3 rounded-lg ${method.color} ${method.hoverColor} text-white font-medium transition-colors duration-200`}
										>
											{content.support_contact_now}
										</button>
									) : (
										<span className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-300 text-gray-500 font-medium cursor-not-allowed">
											{content.support_coming_soon}
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Features Section */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							{content.support_why_choose_title}
						</h2>
						<p className="text-lg text-gray-600">
							{content.support_why_choose_description}
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="text-center">
								<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
									<feature.icon className="h-8 w-8 text-blue-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* FAQ Section */}
				<div className="bg-white rounded-2xl shadow-lg p-8">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							{content.support_faq_title}
						</h2>
						<p className="text-lg text-gray-600">
							{content.support_faq_description}
						</p>
					</div>

					<div className="space-y-6">
						{faqItems.map((item, index) => (
							<div
								key={index}
								className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
							>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{item.question}
								</h3>
								<p className="text-gray-600">{item.answer}</p>
							</div>
						))}
					</div>
				</div>

				{/* Contact Info */}
				<div className="mt-12 text-center">
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
						<div className="flex items-center justify-center mb-4">
							<Clock className="h-6 w-6 mr-2" />
							<span className="text-lg font-semibold">
								{content.support_hours_title}
							</span>
						</div>
						<p className="text-blue-100 mb-4">
							{content.support_hours_weekdays}
						</p>
						<p className="text-blue-100">{content.support_hours_weekend}</p>
					</div>
				</div>
			</div>

			{/* Mobile Contact Modal */}
			{isModalOpen && selectedMethod && (
				<div
					style={modalStyle}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
				>
					<div ref={modalRef} style={contentStyle}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '24px',
							}}
						>
							<h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
								{content.support_modal_title}
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label={content.close}
								onClick={closeModal}
								style={{ fontSize: '24px' }}
							></button>
						</div>

						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
							}}
						>
							<div
								className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${selectedMethod.color} mb-6`}
							>
								<selectedMethod.icon className="h-10 w-10 text-white" />
							</div>

							<h3 className="text-2xl font-semibold text-gray-900 mb-4">
								{selectedMethod.title}
							</h3>

							<p className="text-gray-600 mb-6 text-lg">
								{selectedMethod.description}
							</p>

							<div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
								<p className="text-sm text-gray-500 mb-2">
									{content.support_modal_contact_info}
								</p>
								<p className="text-lg font-medium text-gray-900 break-words">
									{selectedMethod.contact}
								</p>
							</div>

							{!selectedMethod.disabled ? (
								<a
									href={selectedMethod.action}
									className={`inline-flex items-center px-8 py-4 rounded-lg ${selectedMethod.color} ${selectedMethod.hoverColor} text-white text-lg font-medium transition-colors duration-200 w-full justify-center`}
									onClick={closeModal}
								>
									{content.support_contact_now}
								</a>
							) : (
								<span className="inline-flex items-center px-8 py-4 rounded-lg bg-gray-300 text-gray-500 text-lg font-medium w-full justify-center">
									{content.support_coming_soon}
								</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SupportPage;
