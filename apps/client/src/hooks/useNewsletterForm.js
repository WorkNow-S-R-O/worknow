import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'react-intlayer';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { API_URL } from '@/config';

const useNewsletterForm = ({ content, onSuccess }) => {
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isUnsubscribing, setIsUnsubscribing] = useState(false);
	const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
	const [subscriberData, setSubscriberData] = useState(null);

	const [showVerification, setShowVerification] = useState(false);
	const [subscriptionData, setSubscriptionData] = useState(null);

	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCities, setSelectedCities] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedEmployment, setSelectedEmployment] = useState([]);
	const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const [selectedGender, setSelectedGender] = useState([]);
	const [onlyDemanded, setOnlyDemanded] = useState(false);

	const [isLoadingCities, setIsLoadingCities] = useState(true);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);

	const { locale } = useLocale();
	const { user, isLoaded } = useUser();

	const clearForm = useCallback(() => {
		setEmail('');
		setFirstName('');
		setLastName('');
		setIsAlreadySubscribed(false);
		setSubscriberData(null);
	}, []);

	const prefillFromSubscriber = useCallback((subscriber) => {
		if (!subscriber) return;
		setFirstName(subscriber.firstName || '');
		setLastName(subscriber.lastName || '');
		setSelectedCities(subscriber.preferredCities || []);
		setSelectedCategories(subscriber.preferredCategories || []);
		setSelectedEmployment(subscriber.preferredEmployment || []);
		setSelectedLanguages(subscriber.preferredLanguages || []);
		setSelectedGender(
			Array.isArray(subscriber.preferredGender)
				? subscriber.preferredGender
				: subscriber.preferredGender
					? [subscriber.preferredGender]
					: [],
		);
		setSelectedDocumentTypes(subscriber.preferredDocumentTypes || []);
		setOnlyDemanded(subscriber.onlyDemanded || false);
	}, []);

	const checkSubscriptionStatus = useCallback(
		async (emailToCheck) => {
			if (
				!emailToCheck ||
				!emailToCheck.trim() ||
				!emailToCheck.includes('@')
			) {
				setIsAlreadySubscribed(false);
				setSubscriberData(null);
				return;
			}

			try {
				const response = await axios.get(
					`${API_URL}/api/newsletter/check-subscription`,
					{ params: { email: emailToCheck.trim() } },
				);

				if (response.data.isSubscribed) {
					setIsAlreadySubscribed(true);
					setSubscriberData(response.data.subscriber);
					prefillFromSubscriber(response.data.subscriber);
				} else {
					setIsAlreadySubscribed(false);
					setSubscriberData(null);
				}
			} catch (error) {
				console.error('Error checking subscription status:', error);
				setIsAlreadySubscribed(false);
				setSubscriberData(null);
			}
		},
		[prefillFromSubscriber],
	);

	const fetchFilterData = useCallback(() => {
		Promise.all([
			fetch(`${API_URL}/api/cities?lang=${locale}`).then((res) => res.json()),
			fetch(`${API_URL}/api/categories?lang=${locale}`).then((res) =>
				res.json(),
			),
		])
			.then(([citiesData, categoriesData]) => {
				setCities(citiesData);
				setCategories(categoriesData);
				setIsLoadingCities(false);
				setIsLoadingCategories(false);
			})
			.catch((error) => {
				console.error('Error fetching filter data:', error);
				setCities([]);
				setCategories([]);
				setIsLoadingCities(false);
				setIsLoadingCategories(false);
			});
	}, [locale]);

	const initForm = useCallback(() => {
		if (!isLoaded) return;

		if (user?.primaryEmailAddress?.emailAddress) {
			const userEmail = user.primaryEmailAddress.emailAddress;
			setEmail(userEmail);
			checkSubscriptionStatus(userEmail);
		} else {
			clearForm();
		}

		fetchFilterData();
	}, [isLoaded, user, checkSubscriptionStatus, clearForm, fetchFilterData]);

	const handleSubscribe = async () => {
		if (!email || !email.trim()) {
			toast.error(content.newsletterEmailRequired.value);
			return;
		}

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
					language: 'ru',
					preferences: {},
					preferredCities: selectedCities,
					preferredCategories: selectedCategories,
					preferredEmployment: selectedEmployment,
					preferredLanguages: selectedLanguages,
					preferredGender:
						selectedGender.length > 0 ? selectedGender[0] : null,
					preferredDocumentTypes: selectedDocumentTypes,
					onlyDemanded,
				},
			);

			if (response.data.success) {
				toast.success(content.verificationCodeSent.value);
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

	const handleUnsubscribe = async () => {
		if (!email || !email.trim()) {
			toast.error(content.newsletterEmailRequired.value);
			return;
		}

		setIsUnsubscribing(true);

		try {
			const response = await axios.post(
				`${API_URL}/api/newsletter/unsubscribe`,
				{ email: email.trim() },
			);

			if (response.data.success) {
				toast.success(content.newsletterUnsubscribeSuccess.value);
				clearForm();
				onSuccess?.();
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

	const handleEmailChange = (e) => {
		const newEmail = e.target.value;
		setEmail(newEmail);

		if (!isAlreadySubscribed && newEmail && newEmail.includes('@')) {
			setTimeout(() => {
				checkSubscriptionStatus(newEmail);
			}, 500);
		}
	};

	const handleVerificationSuccess = (subscriber) => {
		setIsAlreadySubscribed(true);
		setSubscriberData(subscriber);
		setShowVerification(false);
		onSuccess?.();
	};

	const handleVerificationClose = () => {
		setShowVerification(false);
		setSubscriptionData(null);
	};

	return {
		// State
		email,
		firstName,
		setFirstName,
		lastName,
		setLastName,
		isSubscribing,
		isUnsubscribing,
		isAlreadySubscribed,
		subscriberData,
		showVerification,
		subscriptionData,
		cities,
		categories,
		selectedCities,
		setSelectedCities,
		selectedCategories,
		setSelectedCategories,
		selectedEmployment,
		setSelectedEmployment,
		selectedDocumentTypes,
		setSelectedDocumentTypes,
		selectedLanguages,
		setSelectedLanguages,
		selectedGender,
		setSelectedGender,
		onlyDemanded,
		setOnlyDemanded,
		isLoadingCities,
		isLoadingCategories,

		// Actions
		initForm,
		handleSubscribe,
		handleUnsubscribe,
		handleEmailChange,
		handleVerificationSuccess,
		handleVerificationClose,
	};
};

export default useNewsletterForm;
