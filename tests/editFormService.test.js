import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

import {
	mockJobId,
	mockUpdatePayload,
	badTitle,
	badDescription,
	createExistingJob,
	createUpdatedJob,
	createPremiumUpdatedJob,
	mockPremiumUserJobs,
} from '@mocks/editFormService.js';

const jobFindUniqueMock = vi.fn();
const jobUpdateMock = vi.fn();
const jobFindManyMock = vi.fn();
const containsBadWordsMock = vi.fn();
const containsLinksMock = vi.fn();
const sendUpdatedJobListToTelegramMock = vi.fn();

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => ({
		job: {
			findUnique: jobFindUniqueMock,
			update: jobUpdateMock,
			findMany: jobFindManyMock,
		},
	})),
}));

vi.mock('../apps/api/middlewares/validation.js', () => ({
	containsBadWords: containsBadWordsMock,
	containsLinks: containsLinksMock,
}));

vi.mock('../apps/api/utils/telegram.js', () => ({
	sendUpdatedJobListToTelegram: sendUpdatedJobListToTelegramMock,
}));

let updateJobService;

beforeAll(async () => {
	({ updateJobService } = await import('../apps/api/services/editFormService.js'));
});

beforeEach(() => {
	[
		jobFindUniqueMock,
		jobUpdateMock,
		jobFindManyMock,
		containsBadWordsMock,
		containsLinksMock,
		sendUpdatedJobListToTelegramMock,
	].forEach((mockFn) => mockFn.mockReset());

	containsBadWordsMock.mockReturnValue(false);
	containsLinksMock.mockReturnValue(false);
});

describe('updateJobService', () => {
	it('returns validation errors when payload contains restricted content', async () => {
		containsBadWordsMock.mockImplementation((value) =>
			value === badTitle || value === badDescription,
		);
		containsLinksMock.mockImplementation((value) => value.includes('http'));

		const invalidPayload = {
			...mockUpdatePayload,
			title: badTitle,
			description: badDescription,
		};

		const result = await updateJobService(mockJobId, invalidPayload);

		expect(result).toEqual({
			errors: [
				'Заголовок содержит нецензурные слова.',
				'Описание содержит нецензурные слова.',
				'Заголовок содержит запрещенные ссылки.',
				'Описание содержит запрещенные ссылки.',
			],
		});
		expect(jobFindUniqueMock).not.toHaveBeenCalled();
	});

	it('returns an error when the job cannot be found', async () => {
		jobFindUniqueMock.mockResolvedValue(null);

		const result = await updateJobService(mockJobId, mockUpdatePayload);

		expect(jobFindUniqueMock).toHaveBeenCalledWith({
			where: { id: Number(mockJobId) },
			include: { user: true },
		});
		expect(result).toEqual({ error: 'Объявление не найдено' });
		expect(jobUpdateMock).not.toHaveBeenCalled();
	});

	it('returns an error when the authenticated user does not own the job', async () => {
		jobFindUniqueMock.mockResolvedValue(
			createExistingJob({ user: { clerkUserId: 'other-user' } }),
		);

		const result = await updateJobService(mockJobId, mockUpdatePayload);

		expect(result).toEqual({
			error: 'У вас нет прав для редактирования этого объявления',
		});
		expect(jobUpdateMock).not.toHaveBeenCalled();
	});

	it('updates the job and returns the updated record for non-premium users', async () => {
		const updatedJob = createUpdatedJob();
		jobFindUniqueMock.mockResolvedValue(createExistingJob());
		jobUpdateMock.mockResolvedValue(updatedJob);

		const result = await updateJobService(mockJobId, mockUpdatePayload);

		expect(jobUpdateMock).toHaveBeenCalledWith({
			where: { id: Number(mockJobId) },
			data: {
				title: mockUpdatePayload.title,
				salary: mockUpdatePayload.salary,
				phone: mockUpdatePayload.phone,
				description: mockUpdatePayload.description,
				imageUrl: mockUpdatePayload.imageUrl,
				city: { connect: { id: Number(mockUpdatePayload.cityId) } },
				category: { connect: { id: Number(mockUpdatePayload.categoryId) } },
				shuttle: mockUpdatePayload.shuttle,
				meals: mockUpdatePayload.meals,
			},
			include: { city: true, user: true, category: true },
		});
		expect(result).toEqual({ updatedJob });
		expect(jobFindManyMock).not.toHaveBeenCalled();
		expect(sendUpdatedJobListToTelegramMock).not.toHaveBeenCalled();
	});

	it('sends an updated job list to Telegram for premium users', async () => {
		const premiumUpdatedJob = createPremiumUpdatedJob();
		jobFindUniqueMock.mockResolvedValue(createExistingJob());
		jobUpdateMock.mockResolvedValue(premiumUpdatedJob);
		jobFindManyMock.mockResolvedValue(mockPremiumUserJobs);

		const result = await updateJobService(mockJobId, mockUpdatePayload);

		expect(jobFindManyMock).toHaveBeenCalledWith({
			where: { userId: premiumUpdatedJob.user.id },
			include: { city: true },
		});
		expect(sendUpdatedJobListToTelegramMock).toHaveBeenCalledWith(
			premiumUpdatedJob.user,
			mockPremiumUserJobs,
		);
		expect(result).toEqual({ updatedJob: premiumUpdatedJob });
	});

	it('returns an error response when the update operation fails', async () => {
		const dbError = new Error('database unavailable');
		jobFindUniqueMock.mockResolvedValue(createExistingJob());
		jobUpdateMock.mockRejectedValue(dbError);

		const result = await updateJobService(mockJobId, mockUpdatePayload);

		expect(result).toEqual({
			error: 'Ошибка обновления объявления',
			details: dbError.message,
		});
		expect(jobFindManyMock).not.toHaveBeenCalled();
		expect(sendUpdatedJobListToTelegramMock).not.toHaveBeenCalled();
	});
});
