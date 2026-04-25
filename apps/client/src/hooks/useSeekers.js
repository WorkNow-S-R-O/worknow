import useFetchPaginated from './useFetchPaginated';

const FILTER_KEYS = ['city', 'category', 'employment', 'documentType', 'languages', 'gender', 'isDemanded'];

const buildSeekerParams = (params, filters) => {
	if (filters.city) params.append('city', filters.city);
	if (filters.category) params.append('category', filters.category);
	if (filters.employment) params.append('employment', filters.employment);
	if (filters.documentType) params.append('documentType', filters.documentType);
	if (filters.gender) params.append('gender', filters.gender);
	if (filters.isDemanded !== undefined) params.append('isDemanded', filters.isDemanded);

	// Handle languages array
	if (
		filters.languages &&
		Array.isArray(filters.languages) &&
		filters.languages.length > 0
	) {
		filters.languages.forEach((lang) => {
			params.append('languages', lang);
		});
	}
};

const useSeekers = (page = 1, filters = {}, forceRefresh = 0) => {
	const { data: seekers, loading, error, pagination } = useFetchPaginated({
		endpoint: '/api/seekers',
		page,
		filters,
		filterKeys: FILTER_KEYS,
		dataKey: 'seekers',
		buildParams: buildSeekerParams,
		extraDeps: [forceRefresh],
		errorLogMessage: '❌ Ошибка загрузки соискателей:',
		errorStateMessage: 'Ошибка загрузки соискателей',
	});

	return { seekers, loading, error, pagination };
};

export default useSeekers;
