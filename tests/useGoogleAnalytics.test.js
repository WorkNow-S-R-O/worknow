import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const importHook = async () => {
	vi.resetModules();
	vi.stubEnv('VITE_GA_TRACKING_ID', 'G-TEST-ID');
	const module = await import('@hooks/useGoogleAnalytics.js');
	return module.default;
};

describe('useGoogleAnalytics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		delete window.gtag;
	});

	it('calls gtag with expected payloads when available', async () => {
		window.gtag = vi.fn();

		const useGoogleAnalytics = await importHook();
		const { result } = renderHook(() => useGoogleAnalytics());

		result.current.trackEvent('custom_event');
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'custom_event',
			expect.objectContaining({
				event_category: 'engagement',
				event_label: 'custom_event',
			}),
		);

		window.gtag.mockClear();
		result.current.trackPageView('/premium', 'Premium Page');
		expect(window.gtag).toHaveBeenLastCalledWith(
			'config',
			'G-TEST-ID',
			{
				page_path: '/premium',
				page_title: 'Premium Page',
			},
		);

		window.gtag.mockClear();
		result.current.trackUserRegistration('google');
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'sign_up',
			expect.objectContaining({
				method: 'google',
				event_label: 'user_registration',
			}),
		);

		result.current.trackJobCreation({
			title: 'Engineer',
			city: 'Haifa',
			category: 'IT',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'job_created',
			expect.objectContaining({
				custom_parameters: expect.objectContaining({
					job_title: 'Engineer',
					job_location: 'Haifa',
					job_category: 'IT',
				}),
			}),
		);

		result.current.trackPremiumSubscription({ name: 'Pro', price: 99 });
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'purchase',
			expect.objectContaining({
				transaction_id: expect.stringMatching(/^premium_/),
				value: 99,
				currency: 'ILS',
				custom_parameters: expect.objectContaining({
					plan_name: 'Pro',
					plan_price: 99,
				}),
			}),
		);

		result.current.trackJobView({
			title: 'Designer',
			city: 'Tel Aviv',
			category: 'Design',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'job_view',
			expect.objectContaining({
				custom_parameters: expect.objectContaining({
					job_title: 'Designer',
					job_location: 'Tel Aviv',
					job_category: 'Design',
				}),
			}),
		);

		result.current.trackSearch({
			query: 'React',
			location: 'Jerusalem',
			category: 'IT',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'search',
			expect.objectContaining({
				search_term: 'React',
				custom_parameters: expect.objectContaining({
					search_location: 'Jerusalem',
					search_category: 'IT',
				}),
			}),
		);

		result.current.trackFormSubmission({
			form_name: 'job_form',
			form_type: 'create',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'form_submit',
			expect.objectContaining({
				custom_parameters: expect.objectContaining({
					form_name: 'job_form',
					form_type: 'create',
				}),
			}),
		);

		result.current.trackButtonClick({
			button_name: 'Buy Premium',
			location: 'Hero',
			action: 'click',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'button_click',
			expect.objectContaining({
				custom_parameters: expect.objectContaining({
					button_name: 'Buy Premium',
					button_location: 'Hero',
					button_action: 'click',
				}),
			}),
		);

		result.current.trackUserEngagement({
			type: 'scroll',
			duration: 120,
			page: '/jobs',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'user_engagement',
			expect.objectContaining({
				custom_parameters: expect.objectContaining({
					engagement_type: 'scroll',
					engagement_duration: 120,
					engagement_page: '/jobs',
				}),
			}),
		);

		result.current.trackError({
			error_type: 'network',
			message: 'Failed request',
			location: 'hook',
			stack: 'stack-trace',
		});
		expect(window.gtag).toHaveBeenLastCalledWith(
			'event',
			'error',
			expect.objectContaining({
				custom_parameters: expect.objectContaining({
					error_message: 'Failed request',
					error_location: 'hook',
					error_stack: 'stack-trace',
				}),
				event_label: 'network',
			}),
		);
	});

	it('is a no-op when gtag is not defined', async () => {
		delete window.gtag;

		const useGoogleAnalytics = await importHook();
		const { result } = renderHook(() => useGoogleAnalytics());

		expect(() => result.current.trackEvent('anything')).not.toThrow();
		expect(window.gtag).toBeUndefined();
	});
});
