import { vi } from 'vitest'

export const useLoading = vi.fn(() => ({
  startLoading: vi.fn(),
  stopLoading: vi.fn(),
  updateProgress: vi.fn()
}))

export const LoadingProvider = ({ children }) => children

// Reset mocks before each test
export const resetLoadingMocks = () => {
  useLoading.mockClear()
}
