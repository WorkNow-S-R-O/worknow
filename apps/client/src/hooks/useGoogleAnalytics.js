import { useCallback } from 'react';

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';

export const useGoogleAnalytics = () => {
	// Track custom events
	const trackEvent = useCallback((eventName, parameters = {}) => {
		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('event', eventName, {
				...parameters,
				event_category: parameters.event_category || 'engagement',
				event_label: parameters.event_label || eventName,
			});
		}
	}, []);

	// Track page views
	const trackPageView = useCallback((url, title) => {
		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('config', GA_TRACKING_ID, {
				page_path: url,
				page_title: title || document.title,
			});
		}
	}, []);

	// Track user registration
	const trackUserRegistration = useCallback(
		(method = 'clerk') => {
			trackEvent('sign_up', {
				method,
				event_category: 'engagement',
				event_label: 'user_registration',
			});
		},
		[trackEvent],
	);

	// Track job creation
	const trackJobCreation = useCallback(
		(jobData = {}) => {
			trackEvent('job_created', {
				event_category: 'engagement',
				event_label: 'job_posting',
				custom_parameters: {
					job_title: jobData.title,
					job_location: jobData.city,
					job_category: jobData.category,
				},
			});
		},
		[trackEvent],
	);

	// Track premium subscription
	const trackPremiumSubscription = useCallback(
		(planData = {}) => {
			trackEvent('purchase', {
				transaction_id: `premium_${Date.now()}`,
				value: planData.price || 99,
				currency: 'ILS',
				event_category: 'ecommerce',
				event_label: 'premium_subscription',
				custom_parameters: {
					plan_name: planData.name,
					plan_price: planData.price,
				},
			});
		},
		[trackEvent],
	);

	// Track job application/view
	const trackJobView = useCallback(
		(jobData = {}) => {
			trackEvent('job_view', {
				event_category: 'engagement',
				event_label: 'job_view',
				custom_parameters: {
					job_title: jobData.title,
					job_location: jobData.city,
					job_category: jobData.category,
				},
			});
		},
		[trackEvent],
	);

	// Track search events
	const trackSearch = useCallback(
		(searchData = {}) => {
			trackEvent('search', {
				search_term: searchData.query,
				event_category: 'engagement',
				event_label: 'job_search',
				custom_parameters: {
					search_location: searchData.location,
					search_category: searchData.category,
				},
			});
		},
		[trackEvent],
	);

	// Track form submissions
	const trackFormSubmission = useCallback(
		(formData = {}) => {
			trackEvent('form_submit', {
				event_category: 'engagement',
				event_label: formData.form_name || 'form_submission',
				custom_parameters: {
					form_name: formData.form_name,
					form_type: formData.form_type,
				},
			});
		},
		[trackEvent],
	);

	// Track button clicks
	const trackButtonClick = useCallback(
		(buttonData = {}) => {
			trackEvent('button_click', {
				event_category: 'engagement',
				event_label: buttonData.button_name || 'button_click',
				custom_parameters: {
					button_name: buttonData.button_name,
					button_location: buttonData.location,
					button_action: buttonData.action,
				},
			});
		},
		[trackEvent],
	);

	// Track user engagement
	const trackUserEngagement = useCallback(
		(engagementData = {}) => {
			trackEvent('user_engagement', {
				event_category: 'engagement',
				event_label: engagementData.type || 'general_engagement',
				custom_parameters: {
					engagement_type: engagementData.type,
					engagement_duration: engagementData.duration,
					engagement_page: engagementData.page,
				},
			});
		},
		[trackEvent],
	);

	// Track errors
	const trackError = useCallback(
		(errorData = {}) => {
			trackEvent('error', {
				event_category: 'error',
				event_label: errorData.error_type || 'general_error',
				custom_parameters: {
					error_message: errorData.message,
					error_location: errorData.location,
					error_stack: errorData.stack,
				},
			});
		},
		[trackEvent],
	);

	return {
		trackEvent,
		trackPageView,
		trackUserRegistration,
		trackJobCreation,
		trackPremiumSubscription,
		trackJobView,
		trackSearch,
		trackFormSubmission,
		trackButtonClick,
		trackUserEngagement,
		trackError,
	};
};

export default useGoogleAnalytics;
