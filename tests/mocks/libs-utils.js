import { vi } from 'vitest';

export const showToastError = vi.fn();
export const showToastSuccess = vi.fn();

// Reset mocks before each test
export const resetUtilsMocks = () => {
	showToastError.mockClear();
	showToastSuccess.mockClear();
};
