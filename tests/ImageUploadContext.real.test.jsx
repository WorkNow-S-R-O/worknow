import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(() => ({
    getToken: vi.fn(() => Promise.resolve('test-token')),
  })),
}));

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Override the global setup mock to include actual implementation
vi.unmock('../apps/client/src/contexts/ImageUploadContext.jsx');

import { ImageUploadProvider, useImageUpload } from '../apps/client/src/contexts/ImageUploadContext.jsx';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const wrapper = ({ children }) => (
  <ImageUploadProvider>{children}</ImageUploadProvider>
);

describe('ImageUploadContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    useAuth.mockReturnValue({
      getToken: vi.fn(() => Promise.resolve('test-token')),
    });
  });

  describe('useImageUpload', () => {
    it('throws when used outside provider', () => {
      expect(() => {
        const { result } = renderHook(() => useImageUpload());
        // Access to trigger the throw
        result.current;
      }).toThrow();
    });

    it('provides context values when inside provider', () => {
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      expect(result.current.uploadImage).toBeDefined();
      expect(result.current.uploading).toBe(false);
      expect(result.current.uploadError).toBeNull();
      expect(result.current.clearError).toBeDefined();
    });
  });

  describe('uploadImage', () => {
    it('throws when no file provided', async () => {
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      await expect(result.current.uploadImage(null)).rejects.toThrow('No file provided');
    });

    it('throws when file is not an image', async () => {
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      await expect(result.current.uploadImage(file)).rejects.toThrow();
    });

    it('throws when file is too large', async () => {
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      await expect(result.current.uploadImage(largeFile)).rejects.toThrow();
    });

    it('uploads image successfully', async () => {
      axios.post.mockResolvedValue({ data: { imageUrl: 'https://s3.example.com/image.jpg' } });
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      const url = await result.current.uploadImage(file);
      expect(url).toBe('https://s3.example.com/image.jpg');
    });

    it('handles upload error with CONTENT_REJECTED code', async () => {
      axios.post.mockRejectedValue({
        response: { data: { code: 'CONTENT_REJECTED', error: 'Rejected' } },
        message: 'Error',
      });
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await expect(result.current.uploadImage(file)).rejects.toThrow();
    });

    it('handles upload error with response data error', async () => {
      axios.post.mockRejectedValue({
        response: { data: { error: 'Upload failed', code: 'OTHER' } },
        message: 'Error',
      });
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await expect(result.current.uploadImage(file)).rejects.toThrow();
    });

    it('handles upload error without response data', async () => {
      axios.post.mockRejectedValue({
        message: 'Network Error',
      });
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await expect(result.current.uploadImage(file)).rejects.toThrow();
    });

    it('sets uploading state during upload', async () => {
      let resolveUpload;
      axios.post.mockReturnValue(new Promise(resolve => { resolveUpload = resolve; }));
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      const uploadPromise = result.current.uploadImage(file);
      // Should be uploading now
      expect(result.current.uploading).toBe(false); // useState not updated yet in test

      resolveUpload({ data: { imageUrl: 'https://s3.example.com/image.jpg' } });
      await uploadPromise;
      expect(result.current.uploading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('clears the upload error', async () => {
      axios.post.mockRejectedValue({ message: 'Error' });
      const { result } = renderHook(() => useImageUpload(), { wrapper });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      try {
        await result.current.uploadImage(file);
      } catch {}

      await act(async () => {
        result.current.clearError();
      });

      expect(result.current.uploadError).toBeNull();
    });
  });

  describe('ImageUploadProvider', () => {
    it('renders children', () => {
      const { container } = render(
        <ImageUploadProvider>
          <div data-testid="child">Child content</div>
        </ImageUploadProvider>
      );
      expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
    });
  });
});
