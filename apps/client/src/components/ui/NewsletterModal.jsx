import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntlayer, useLocale } from 'react-intlayer';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import VerificationModal from './VerificationModal.jsx';
import NewsletterHeader from './NewsletterHeader.jsx';
import NewsletterStatus from './NewsletterStatus.jsx';
import NewsletterForm from './NewsletterForm.jsx';
import NewsletterFilters from './NewsletterFilters.jsx';
import NewsletterActions from './NewsletterActions.jsx';

const API_URL = import.meta.env.VITE_API_URL;

const NewsletterModal = ({ open, onClose }) => {
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isUnsubscribing, setIsUnsubscribing] = useState(false);
	const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
	const [subscriberData, setSubscriberData] = useState(null);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	// Verification state
	const [showVerification, setShowVerification] = useState(false);
	const [subscriptionData, setSubscriptionData] = useState(null);

	// Filter preferences state
	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCities, setSelectedCities] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedEmployment, setSelectedEmployment] = useState([]);
	const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const [selectedGender, setSelectedGender] = useState([]);
	const [onlyDemanded, setOnlyDemanded] = useState(false);

	const modalRef = useRef();
	const content = useIntlayer('newsletterModal');
	const { locale } = useLocale();
	const { user, isLoaded } = useUser();

	// Determine if mobile
	const isMobile = window.innerWidth <= 768;

	// Minimum swipe distance (in px)
	const minSwipeDistance = 50;

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
			onClose();
		}
	};

	// Handle outside click for desktop
	const handleOutsideClick = (event) => {
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			onClose();
		}
	};

	// Check subscription status for an email
	const checkSubscriptionStatus = useCallback(async (email) => {
		if (!email || !email.trim() || !email.includes('@')) {
			setIsAlreadySubscribed(false);
			setSubscriberData(null);
			return;
		}

		try {
			const response = await axios.get(
				`${API_URL}/api/newsletter/check-subscription`,
				{
					params: { email: email.trim() },
				},
			);

			if (response.data.isSubscribed) {
				setIsAlreadySubscribed(true);
				setSubscriberData(response.data.subscriber);
				// Pre-fill the form with existing data
				if (response.data.subscriber) {
					setFirstName(response.data.subscriber.firstName || '');
					setLastName(response.data.subscriber.lastName || '');
					// Pre-fill filter preferences
					setSelectedCities(response.data.subscriber.preferredCities || []);
					setSelectedCategories(
						response.data.subscriber.preferredCategories || [],
					);
					setSelectedEmployment(
						response.data.subscriber.preferredEmployment || [],
					);
					setSelectedLanguages(
						response.data.subscriber.preferredLanguages || [],
					);
					setSelectedGender(response.data.subscriber.preferredGender || []);
					setSelectedDocumentTypes(
						response.data.subscriber.preferredDocumentTypes || [],
					);
					setOnlyDemanded(response.data.subscriber.onlyDemanded || false);
				}
			} else {
				setIsAlreadySubscribed(false);
				setSubscriberData(null);
			}
		} catch (error) {
			console.error('Error checking subscription status:', error);
			setIsAlreadySubscribed(false);
			setSubscriberData(null);
		}
	}, []);

	// Check for logged-in user's email when modal opens
	useEffect(() => {
		if (open && isLoaded) {
			if (user && user.primaryEmailAddress?.emailAddress) {
				const userEmail = user.primaryEmailAddress.emailAddress;
				setEmail(userEmail);
				checkSubscriptionStatus(userEmail);
			} else {
				// If no user is logged in, clear the form
				setEmail('');
				setFirstName('');
				setLastName('');
				setIsAlreadySubscribed(false);
				setSubscriberData(null);
			}

			// Fetch cities and categories for filter options
			Promise.all([
				fetch(`${API_URL}/api/cities?lang=${locale}`).then((res) => res.json()),
				fetch(`${API_URL}/api/categories?lang=${locale}`).then((res) =>
					res.json(),
				),
			])
				.then(([citiesData, categoriesData]) => {
					setCities(citiesData);
					setCategories(categoriesData);
				})
				.catch((error) => {
					console.error('Error fetching filter data:', error);
					setCities([]);
					setCategories([]);
				});
		}
	}, [open, isLoaded, user, locale, checkSubscriptionStatus]);

	const handleSubscribe = async () => {
		if (!email || !email.trim()) {
			toast.error(content.newsletterEmailRequired.value);
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error(content.newsletterInvalidEmail.value);
			return;
		}

		setIsSubscribing(true);

		try {
			const response = await axios.post(
				`${API_URL}/api/newsletter/send-verification`,
				{
					email: email.trim(),
					firstName: firstName.trim() || null,
					lastName: lastName.trim() || null,
					language: 'ru', // Default to Russian
					preferences: {},
					// Filter preferences
					preferredCities: selectedCities,
					preferredCategories: selectedCategories,
					preferredEmployment: selectedEmployment,
					preferredLanguages: selectedLanguages,
					preferredGender: selectedGender.length > 0 ? selectedGender[0] : null,
					preferredDocumentTypes: selectedDocumentTypes,
					onlyDemanded,
				},
			);

			if (response.data.success) {
				toast.success(content.verificationCodeSent.value);
				// Store subscription data and show verification modal
				setSubscriptionData(response.data.subscriptionData);
				setShowVerification(true);
			} else {
				toast.error(response.data.message || content.newsletterError.value);
			}
		} catch (error) {
			console.error('Newsletter verification error:', error);
			if (error.response?.status === 409) {
				toast.error('Этот email уже подписан на рассылку');
			} else if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error(content.newsletterError.value);
			}
		} finally {
			setIsSubscribing(false);
		}
	};

	// Handle unsubscribe
	const handleUnsubscribe = async () => {
		if (!email || !email.trim()) {
			toast.error(content.newsletterEmailRequired.value);
			return;
		}

		setIsUnsubscribing(true);

		try {
			const response = await axios.post(
				`${API_URL}/api/newsletter/unsubscribe`,
				{
					email: email.trim(),
				},
			);

			if (response.data.success) {
				toast.success(content.newsletterUnsubscribeSuccess.value);
				setIsAlreadySubscribed(false);
				setSubscriberData(null);
				setEmail('');
				setFirstName('');
				setLastName('');
				onClose();
			} else {
				toast.error(
					response.data.message || content.newsletterUnsubscribeError.value,
				);
			}
		} catch (error) {
			console.error('Newsletter unsubscribe error:', error);
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error(content.newsletterUnsubscribeError.value);
			}
		} finally {
			setIsUnsubscribing(false);
		}
	};

	// Handle verification success
	const handleVerificationSuccess = (subscriber) => {
		setIsAlreadySubscribed(true);
		setSubscriberData(subscriber);
		setShowVerification(false);
		onClose();
	};

	// Handle verification modal close
	const handleVerificationClose = () => {
		setShowVerification(false);
		setSubscriptionData(null);
	};

	// Handle email change (only for new subscriptions or when user is not logged in)
	const handleEmailChange = (e) => {
		const newEmail = e.target.value;
		setEmail(newEmail);

		// Only check subscription status if user is not already subscribed
		if (!isAlreadySubscribed && newEmail && newEmail.includes('@')) {
			// Add a small delay to avoid too many API calls
			setTimeout(() => {
				checkSubscriptionStatus(newEmail);
			}, 500);
		}
	};

	// Filter change handlers
	const handleCityChange = (city, checked) => {
		if (checked) {
			setSelectedCities([...selectedCities, city.name]);
		} else {
			setSelectedCities(selectedCities.filter((c) => c !== city.name));
		}
	};

	const handleCategoryChange = (category, checked) => {
		const value = category.label || category.name;
		if (checked) {
			setSelectedCategories([...selectedCategories, value]);
		} else {
			setSelectedCategories(selectedCategories.filter((c) => c !== value));
		}
	};

	const handleEmploymentChange = (option, checked) => {
		if (checked) {
			setSelectedEmployment([...selectedEmployment, option.value]);
		} else {
			setSelectedEmployment(
				selectedEmployment.filter((emp) => emp !== option.value),
			);
		}
	};

	const handleDocumentTypeChange = (option, checked) => {
		if (checked) {
			setSelectedDocumentTypes([...selectedDocumentTypes, option.value]);
		} else {
			setSelectedDocumentTypes(
				selectedDocumentTypes.filter((doc) => doc !== option.value),
			);
		}
	};

	const handleLanguageChange = (languageValue, checked) => {
		if (checked) {
			setSelectedLanguages([...selectedLanguages, languageValue]);
		} else {
			setSelectedLanguages(
				selectedLanguages.filter((lang) => lang !== languageValue),
			);
		}
	};

	const handleGenderChange = (genderValue, checked) => {
		if (checked) {
			setSelectedGender([...selectedGender, genderValue]);
		} else {
			setSelectedGender(selectedGender.filter((g) => g !== genderValue));
		}
	};

	// Fullscreen modal for mobile, original overlay for desktop
	const modalStyle = isMobile
		? {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: '100vw',
				height: '100vh',
				background: '#fff',
				zIndex: 9999,
				display: 'flex',
				flexDirection: 'column',
			}
		: {
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

	const contentStyle = isMobile
		? {
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
			}
		: {
				background: '#fff',
				borderRadius: 18,
				padding: 40,
				width: 900,
				height: 900,
				maxWidth: '95vw',
				maxHeight: '95vh',
				boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
			};

	if (!open) return null;

	return (
		<>
			<div
				style={modalStyle}
				onTouchStart={isMobile ? onTouchStart : undefined}
				onTouchMove={isMobile ? onTouchMove : undefined}
				onTouchEnd={isMobile ? onTouchEnd : undefined}
				onMouseDown={!isMobile ? handleOutsideClick : undefined}
			>
				<div ref={modalRef} style={contentStyle}>
					<NewsletterHeader onClose={onClose} isMobile={isMobile} />

					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<div style={{ marginBottom: '24px' }}>
							<NewsletterStatus
								isAlreadySubscribed={isAlreadySubscribed}
								subscriberData={subscriberData}
								email={email}
								isMobile={isMobile}
							/>

							<NewsletterForm
								email={email}
								firstName={firstName}
								lastName={lastName}
								onEmailChange={handleEmailChange}
								onFirstNameChange={(e) => setFirstName(e.target.value)}
								onLastNameChange={(e) => setLastName(e.target.value)}
								isSubscribing={isSubscribing}
								isUnsubscribing={isUnsubscribing}
								isAlreadySubscribed={isAlreadySubscribed}
								isMobile={isMobile}
							/>

							{/* Filter Preferences Section */}
							{!isAlreadySubscribed && (
								<div style={{ marginBottom: '20px' }}>
									<h6
										style={{
											marginBottom: '16px',
											fontSize: isMobile ? '16px' : '14px',
											fontWeight: '600',
											color: '#333',
										}}
									>
										Получать уведомления о кандидатах:
									</h6>

									<NewsletterFilters
										cities={cities}
										categories={categories}
										selectedCities={selectedCities}
										selectedCategories={selectedCategories}
										selectedEmployment={selectedEmployment}
										selectedDocumentTypes={selectedDocumentTypes}
										selectedLanguages={selectedLanguages}
										selectedGender={selectedGender}
										onlyDemanded={onlyDemanded}
										onCityChange={handleCityChange}
										onCategoryChange={handleCategoryChange}
										onEmploymentChange={handleEmploymentChange}
										onDocumentTypeChange={handleDocumentTypeChange}
										onLanguageChange={handleLanguageChange}
										onGenderChange={handleGenderChange}
										onOnlyDemandedChange={setOnlyDemanded}
										isSubscribing={isSubscribing}
										isUnsubscribing={isUnsubscribing}
										isMobile={isMobile}
									/>
								</div>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					<div
						className="d-flex justify-content-between mt-4"
						style={{
							marginTop: '20px',
							paddingTop: '20px',
							borderTop: '1px solid #e0e0e0',
						}}
					>
						<NewsletterActions
							isAlreadySubscribed={isAlreadySubscribed}
							isSubscribing={isSubscribing}
							isUnsubscribing={isUnsubscribing}
							onSubscribe={handleSubscribe}
							onUnsubscribe={handleUnsubscribe}
							isMobile={isMobile}
						/>
					</div>
				</div>
			</div>

			{/* Verification Modal */}
			<VerificationModal
				open={showVerification}
				onClose={handleVerificationClose}
				email={email}
				subscriptionData={subscriptionData}
				onVerificationSuccess={handleVerificationSuccess}
			/>
		</>
	);
};

NewsletterModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default NewsletterModal;
