import { vi } from 'vitest'

export const createJob = vi.fn()
export const createJobWithImage = vi.fn()

// Reset mocks before each test
export const resetJobMocks = () => {
  createJob.mockClear()
  createJobWithImage.mockClear()
}
