import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

import {
	mockApiUrl,
	mockJobPayload,
	mockJobResponse,
	createAxiosResponse,
} from '@mocks/jobCreationService.js';

vi.mock('axios');

const importService = async () => {
	vi.resetModules();
	vi.stubEnv('VITE_API_URL', mockApiUrl);
	return import('@services/jobCreationService.js');
};

describe('jobCreationService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('posts job data and returns the created job', async () => {
		axios.post.mockResolvedValueOnce(createAxiosResponse(mockJobResponse));

		const { createJob } = await importService();
		const result = await createJob(mockJobPayload);

		expect(axios.post).toHaveBeenCalledWith(
			`${mockApiUrl}/api/jobs`,
			mockJobPayload,
		);
		expect(result).toEqual(mockJobResponse);
	});

	it('propagates API errors to the caller', async () => {
		const apiError = new Error('create failed');
		axios.post.mockRejectedValueOnce(apiError);

		const { createJob } = await importService();

		await expect(createJob(mockJobPayload)).rejects.toThrow(apiError);
	});
});
