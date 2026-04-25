import useFetchPaginated from './useFetchPaginated';

const FILTER_KEYS = ['salary', 'categoryId', 'shuttleOnly', 'mealsOnly', 'city'];

const buildJobParams = (params, filters) => {
	if (filters.salary) params.append('salary', filters.salary);
	if (filters.categoryId) params.append('category', filters.categoryId);
	if (filters.shuttleOnly) params.append('shuttle', 'true');
	if (filters.mealsOnly) params.append('meals', 'true');
	if (filters.city) params.append('city', filters.city);
};

const useJobs = (page = 1, filters = {}) => {
	const { data: jobs, loading, pagination } = useFetchPaginated({
		endpoint: '/api/jobs',
		page,
		filters,
		filterKeys: FILTER_KEYS,
		dataKey: 'jobs',
		buildParams: buildJobParams,
		errorLogMessage: '❌ Ошибка загрузки вакансий:',
	});

	return { jobs, loading, pagination };
};

export default useJobs;
