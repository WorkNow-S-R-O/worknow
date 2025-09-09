import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'react-intlayer';
import { useLoadingProgress } from './useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL;

const useSeekers = (page = 1, filters = {}, forceRefresh = 0) => {
	const [seekers, setSeekers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState(null);
	const { locale } = useLocale();
	const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

	// Memoize filters to prevent infinite re-renders
	const memoizedFilters = useMemo(
		() => filters,
		[
			filters.city,
			filters.category,
			filters.employment,
			filters.documentType,
			filters.languages,
			filters.gender,
			filters.isDemanded,
		],
	);

	useEffect(() => {
		// useSeekers useEffect triggered

		const loadSeekers = async () => {
			setLoading(true);

			// Only show loading progress if it takes more than 500ms
			const loadingTimeout = setTimeout(() => {
				startLoadingWithProgress(1500);
			}, 500);

			try {
				// Build query parameters
				const params = new URLSearchParams({
					page: page,
					limit: 10,
					lang: locale,
				});

				// Add filter parameters if they exist
				if (memoizedFilters.city) params.append('city', memoizedFilters.city);
				if (memoizedFilters.category)
					params.append('category', memoizedFilters.category);
				if (memoizedFilters.employment)
					params.append('employment', memoizedFilters.employment);
				if (memoizedFilters.documentType)
					params.append('documentType', memoizedFilters.documentType);
				if (memoizedFilters.gender)
					params.append('gender', memoizedFilters.gender);
				if (memoizedFilters.isDemanded !== undefined)
					params.append('isDemanded', memoizedFilters.isDemanded);

				// Handle languages array
				if (
					memoizedFilters.languages &&
					Array.isArray(memoizedFilters.languages) &&
					memoizedFilters.languages.length > 0
				) {
					memoizedFilters.languages.forEach((lang) => {
						params.append('languages', lang);
					});
				}

				// Fetching seekers from API
				const response = await axios.get(
					`${API_URL}/api/seekers?${params.toString()}`,
				);

				// API Response received

				// Handle API response format with pagination
				if (response.data && response.data.seekers) {
					// New format with pagination
					setSeekers(response.data.seekers);
					setPagination(response.data.pagination);
					// Seekers data processed successfully
				} else if (Array.isArray(response.data)) {
					// Old format - just array of seekers
					setSeekers(response.data);
					setPagination(null);
					// Seekers data processed (old format)
				} else {
					console.error('❌ API вернул неожиданный формат:', response.data);
					setSeekers([]);
					setPagination(null);
				}

				clearTimeout(loadingTimeout);
				completeLoading(); // Complete loading when done
			} catch (error) {
				if (!(error?.code === 'ECONNABORTED')) {
					console.error('❌ Ошибка загрузки соискателей:', error);
					setError('Ошибка загрузки соискателей');
				}
				clearTimeout(loadingTimeout);
				completeLoading(); // Complete loading even on error
			} finally {
				setLoading(false);
			}
		};

		loadSeekers();
	}, [locale, page, memoizedFilters, forceRefresh]); // Use memoized filters to prevent infinite loops

	// useSeekers hook state updated
	return { seekers, loading, error, pagination };
};

export default useSeekers;
