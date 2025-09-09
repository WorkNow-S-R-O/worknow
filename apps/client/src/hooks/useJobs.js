import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// import { toast } from 'react-hot-toast'; // больше не используется
import { useLocale } from 'react-intlayer';
import { useLoadingProgress } from './useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Используем переменную окружения

const useJobs = (page = 1, filters = {}) => {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState(null);
	const { locale } = useLocale();
	const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

	// Memoize filters to prevent infinite re-renders
	const memoizedFilters = useMemo(
		() => filters,
		[
			filters.salary,
			filters.categoryId,
			filters.shuttleOnly,
			filters.mealsOnly,
			filters.city,
		],
	);

	useEffect(() => {
		const loadJobs = async () => {
			setLoading(true);

			// Only show loading progress if it takes more than 500ms
			const loadingTimeout = setTimeout(() => {
				startLoadingWithProgress(1500);
			}, 500);

			try {
				// Build query parameters
				const params = new URLSearchParams({
					lang: locale,
					page: page,
					limit: 10,
				});

				// Add filter parameters if they exist
				if (memoizedFilters.salary)
					params.append('salary', memoizedFilters.salary);
				if (memoizedFilters.categoryId)
					params.append('category', memoizedFilters.categoryId);
				if (memoizedFilters.shuttleOnly) params.append('shuttle', 'true');
				if (memoizedFilters.mealsOnly) params.append('meals', 'true');
				if (memoizedFilters.city) params.append('city', memoizedFilters.city);

				const response = await axios.get(
					`${API_URL}/api/jobs?${params.toString()}`,
				);

				// Handle new API response format with pagination
				if (response.data && response.data.jobs) {
					// New format with pagination
					setJobs(response.data.jobs);
					setPagination(response.data.pagination);
				} else if (Array.isArray(response.data)) {
					// Old format - just array of jobs
					setJobs(response.data);
					setPagination(null);
				} else {
					console.error('❌ API вернул неожиданный формат:', response.data);
					setJobs([]);
					setPagination(null);
				}

				clearTimeout(loadingTimeout);
				completeLoading(); // Complete loading when done
			} catch (error) {
				if (!(error?.code === 'ECONNABORTED')) {
					console.error('❌ Ошибка загрузки вакансий:', error);
				}
				clearTimeout(loadingTimeout);
				completeLoading(); // Complete loading even on error
			} finally {
				setLoading(false);
			}
		};

		loadJobs();
	}, [locale, page, memoizedFilters]); // Use memoized filters to prevent infinite loops

	return { jobs, loading, pagination };
};

export default useJobs;
