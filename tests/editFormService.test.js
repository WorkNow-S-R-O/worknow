import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

import {
	mockApiUrl,
	mockJobId,
	mockJobResponse,
	mockUpdatePayload,
	mockUpdatedJobResponse,
	createAxiosResponse,
} from '@mocks/editFormService.js';

vi.mock('axios');

const importService = async () => {
	vi.resetModules();
	vi.stubEnv('VITE_API_URL', mockApiUrl);
	return import('../apps/api/editFormService.js');
};

describe('editFormService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe('fetchJob', () => {
		it('returns job data when the API call succeeds', async () => {
			axios.get.mockResolvedValueOnce(createAxiosResponse(mockJobResponse));

			const { fetchJob } = await importService();
			const result = await fetchJob(mockJobId);

			expect(axios.get).toHaveBeenCalledWith(`${mockApiUrl}/api/jobs/${mockJobId}`);
			expect(result).toEqual(mockJobResponse);
		});

		it('rethrows errors from the API client', async () => {
			const apiError = new Error('network failure');
			axios.get.mockRejectedValueOnce(apiError);

			const { fetchJob } = await importService();

			await expect(fetchJob(mockJobId)).rejects.toThrow(apiError);
		});
	});

	describe('updateJob', () => {
		it('sends the payload and returns the updated job data', async () => {
			axios.put.mockResolvedValueOnce(createAxiosResponse(mockUpdatedJobResponse));

			const { updateJob } = await importService();
			const result = await updateJob(mockJobId, mockUpdatePayload);

			expect(axios.put).toHaveBeenCalledWith(
				`${mockApiUrl}/api/jobs/${mockJobId}`,
				mockUpdatePayload,
			);
			expect(result).toEqual(mockUpdatedJobResponse);
		});

		it('propagates API errors to the caller', async () => {
			const apiError = new Error('update failed');
			axios.put.mockRejectedValueOnce(apiError);

			const { updateJob } = await importService();

			await expect(updateJob(mockJobId, mockUpdatePayload)).rejects.toThrow(
				apiError,
			);
		});
	});
});
