import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

import { mockApiUrl, mockJobList } from '@mocks/jobListingService.js';

vi.mock('axios');

const importService = async () => {
	vi.resetModules();
	vi.stubEnv('VITE_API_URL', mockApiUrl);
	return import('@services/jobListingService.js');
};

describe('jobListingService', () => {
	const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('returns job list when the API call succeeds', async () => {
		axios.get.mockResolvedValueOnce({ data: mockJobList });

		const { fetchJobs } = await importService();
		const result = await fetchJobs();

		expect(axios.get).toHaveBeenCalledWith(`${mockApiUrl}/api/jobs`);
		expect(result).toEqual(mockJobList);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('logs and returns an empty array when the API call fails', async () => {
		const apiError = new Error('network failure');
		axios.get.mockRejectedValueOnce(apiError);

		const { fetchJobs } = await importService();
		const result = await fetchJobs();

		expect(result).toEqual([]);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Ошибка загрузки объявлений:',
			apiError,
		);
	});
});
