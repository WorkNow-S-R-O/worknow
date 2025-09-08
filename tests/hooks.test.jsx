import { describe, it, expect, vi } from 'vitest'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
  useLocale: () => ({
    locale: 'en'
  }),
  useIntlayer: () => ({
    value: 'test'
  })
}))

// Mock useLoadingProgress hook
vi.mock('../apps/client/src/hooks/useLoadingProgress', () => ({
  useLoadingProgress: () => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn()
  })
}))

describe('Custom Hooks', () => {
  describe('Hook Imports', () => {
    it('can import useJobs hook', async () => {
      // Test that we can import the hook
      const useJobsModule = await import('../apps/client/src/hooks/useJobs')
      expect(useJobsModule).toBeDefined()
      expect(useJobsModule.default || useJobsModule.useJobs).toBeDefined()
    })

    it('can import useUpdateJobs hook', async () => {
      // Test that we can import the hook
      const useUpdateJobsModule = await import('../apps/client/src/hooks/useUpdateJobs')
      expect(useUpdateJobsModule).toBeDefined()
      expect(useUpdateJobsModule.default || useUpdateJobsModule.useUpdateJobs).toBeDefined()
    })

    it('can import useFetchCategories hook', async () => {
      // Test that we can import the hook
      const useFetchCategoriesModule = await import('../apps/client/src/hooks/useFetchCategories')
      expect(useFetchCategoriesModule).toBeDefined()
      expect(useFetchCategoriesModule.default || useFetchCategoriesModule.useFetchCategories).toBeDefined()
    })

    it('can import useFetchCities hook', async () => {
      // Test that we can import the hook
      const useFetchCitiesModule = await import('../apps/client/src/hooks/useFetchCities')
      expect(useFetchCitiesModule).toBeDefined()
      expect(useFetchCitiesModule.default || useFetchCitiesModule.useFetchCities).toBeDefined()
    })

    it('can import useUserSync hook', async () => {
      // Test that we can import the hook
      const useUserSyncModule = await import('../apps/client/src/hooks/useUserSync')
      expect(useUserSyncModule).toBeDefined()
      expect(useUserSyncModule.default || useUserSyncModule.useUserSync).toBeDefined()
    })
  })
})
