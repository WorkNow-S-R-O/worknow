import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useLocale } from 'react-intlayer';
import { useLoadingProgress } from './useLoadingProgress';
import { API_URL } from '@/config';

const useFetchPaginated = ({
	endpoint,
	page = 1,
	limit = 10,
	filters = {},
	filterKeys = [],
	dataKey,
	extraDeps = [],
	buildParams,
	errorLogMessage,
	errorStateMessage,
}) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState(null);
	const { locale } = useLocale();
	const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

	// Memoize filters to prevent infinite re-renders
	const memoizedFilters = useMemo(
		() => filters,
		filterKeys.map((key) => filters[key]),
	);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);

			// Only show loading progress if it takes more than 500ms
			const loadingTimeout = setTimeout(() => {
				startLoadingWithProgress(1500);
			}, 500);

			try {
				const params = new URLSearchParams({
					lang: locale,
					page: page,
					limit: limit,
				});

				// Use custom param builder if provided, otherwise add filters generically
				if (buildParams) {
					buildParams(params, memoizedFilters);
				} else {
					for (const key of filterKeys) {
						const value = memoizedFilters[key];
						if (value !== undefined && value !== null && value !== '' && value !== false) {
							params.append(key, value === true ? 'true' : value);
						}
					}
				}

				const response = await axios.get(
					`${API_URL}${endpoint}?${params.toString()}`,
				);

				// Handle both paginated and plain array response formats
				if (response.data && response.data[dataKey]) {
					setData(response.data[dataKey]);
					setPagination(response.data.pagination);
				} else if (Array.isArray(response.data)) {
					setData(response.data);
					setPagination(null);
				} else {
					console.error('❌ API вернул неожиданный формат:', response.data);
					setData([]);
					setPagination(null);
				}

				clearTimeout(loadingTimeout);
				completeLoading();
			} catch (err) {
				if (!(err?.code === 'ECONNABORTED')) {
					console.error(errorLogMessage || `❌ Ошибка загрузки ${endpoint}:`, err);
					if (errorStateMessage) {
						setError(errorStateMessage);
					}
				}
				clearTimeout(loadingTimeout);
				completeLoading();
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [locale, page, memoizedFilters, ...extraDeps]);

	return { data, loading, error, pagination };
};

export default useFetchPaginated;
