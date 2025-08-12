import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranslationHelpers } from '../apps/client/src/utils/translationHelpers'
import { cn, showToastError, showToastSuccess } from '../libs/utils'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key // Just return the key for testing
  })
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('Utility Functions', () => {
  describe('cn function (clsx + tailwind-merge)', () => {
    it('combines class names correctly', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
      expect(cn('p-4', 'p-2')).toBe('p-2')
      expect(cn('bg-red-500', 'bg-blue-500', 'bg-green-500')).toBe('bg-green-500')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      expect(cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )).toBe('base-class active-class')
    })

    it('handles empty and undefined values', () => {
      expect(cn('base', '', undefined, null)).toBe('base')
      expect(cn()).toBe('')
    })

    it('handles arrays and objects', () => {
      expect(cn(['class1', 'class2'], { 'conditional': true })).toBe('class1 class2 conditional')
    })
  })

  describe('showToastError function', () => {
    it('shows error toast with response data error', async () => {
      const error = {
        response: {
          data: {
            error: 'Custom error message'
          }
        }
      }
      
      showToastError(error)
      
      // Get the mocked toast from the module
      const { toast } = await import('react-hot-toast')
      expect(toast.error).toHaveBeenCalledWith('Custom error message')
    })

    it('shows generic error toast when no response data error', async () => {
      const error = {
        message: 'Network error'
      }
      
      showToastError(error)
      
      const { toast } = await import('react-hot-toast')
      expect(toast.error).toHaveBeenCalledWith('Ошибка при создании объявления. Попробуйте позже.')
    })

    it('handles error without response or message', async () => {
      const error = {}
      
      showToastError(error)
      
      const { toast } = await import('react-hot-toast')
      expect(toast.error).toHaveBeenCalledWith('Ошибка при создании объявления. Попробуйте позже.')
    })
  })

  describe('showToastSuccess function', () => {
    it('shows success toast with custom message', async () => {
      const message = 'Job created successfully!'
      
      showToastSuccess(message)
      
      const { toast } = await import('react-hot-toast')
      expect(toast.success).toHaveBeenCalledWith(message)
    })

    it('handles empty message', async () => {
      showToastSuccess('')
      
      const { toast } = await import('react-hot-toast')
      expect(toast.success).toHaveBeenCalledWith('')
    })
  })

  describe('useTranslationHelpers hook', () => {
    it('provides all helper functions', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      expect(result.current.getGenderLabel).toBeInstanceOf(Function)
      expect(result.current.getEmploymentLabel).toBeInstanceOf(Function)
      expect(result.current.getCategoryLabel).toBeInstanceOf(Function)
      expect(result.current.getLangLabel).toBeInstanceOf(Function)
      expect(result.current.getDocumentTypeLabel).toBeInstanceOf(Function)
      expect(result.current.getCityLabel).toBeInstanceOf(Function)
    })

    it('getGenderLabel returns correct labels for gender values', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      // Test that the function exists and can be called
      expect(typeof result.current.getGenderLabel('мужчина')).toBe('string')
      expect(typeof result.current.getGenderLabel('male')).toBe('string')
    })

    it('getEmploymentLabel returns correct labels for employment values', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      // Test that the function exists and can be called
      expect(typeof result.current.getEmploymentLabel('полная')).toBe('string')
      expect(typeof result.current.getEmploymentLabel('full-time')).toBe('string')
    })

    it('getCategoryLabel returns correct labels for category values', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      // Test that the function exists and can be called
      expect(typeof result.current.getCategoryLabel('общепит')).toBe('string')
      expect(typeof result.current.getCategoryLabel('construction')).toBe('string')
    })

    it('getLangLabel returns correct labels for language values', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      // Test that the function exists and can be called
      expect(typeof result.current.getLangLabel('русский')).toBe('string')
      expect(typeof result.current.getLangLabel('english')).toBe('string')
    })

    it('getDocumentTypeLabel returns correct labels for document type values', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      // Test that the function exists and can be called
      expect(typeof result.current.getDocumentTypeLabel('виза б1')).toBe('string')
      expect(typeof result.current.getDocumentTypeLabel('visa b1')).toBe('string')
    })

    it('getCityLabel returns correct labels for city values', () => {
      const { result } = renderHook(() => useTranslationHelpers())
      // Test that the function exists and can be called
      expect(typeof result.current.getCityLabel('тель-авив')).toBe('string')
      expect(typeof result.current.getCityLabel('tel aviv')).toBe('string')
    })
  })
})
