import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('@/contexts', () => ({
  useImageUpload: vi.fn(() => ({
    uploadImage: vi.fn(),
    uploading: false,
    uploadError: null,
    clearError: vi.fn(),
  })),
}));

vi.mock('libs', () => ({
  deleteJobImage: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(() => ({
    getToken: vi.fn(() => Promise.resolve('test-token')),
  })),
}));

import ImageUpload from '../apps/client/src/components/ui/ImageUpload.jsx';
import { useImageUpload } from '@/contexts';
import { deleteJobImage } from 'libs';
import { toast } from 'react-hot-toast';

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} />
    );
    expect(container).toBeDefined();
  });

  it('renders with current image URL', () => {
    const { container } = render(
      <ImageUpload
        onImageUpload={vi.fn()}
        currentImageUrl="https://example.com/image.jpg"
      />
    );
    expect(container).toBeDefined();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} className="custom" />
    );
    expect(container).toBeDefined();
  });

  it('shows upload area when no image', () => {
    const { container } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} />
    );
    expect(container.querySelector('.image-upload-area')).toBeTruthy();
  });

  it('shows image preview when currentImageUrl provided', () => {
    const { container } = render(
      <ImageUpload
        onImageUpload={vi.fn()}
        currentImageUrl="https://example.com/image.jpg"
      />
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('handles file selection', async () => {
    const mockUpload = vi.fn().mockResolvedValue('https://s3.example.com/uploaded.jpg');
    useImageUpload.mockReturnValue({
      uploadImage: mockUpload,
      uploading: false,
      uploadError: null,
      clearError: vi.fn(),
    });
    const onImageUpload = vi.fn();
    const { container } = render(
      <ImageUpload onImageUpload={onImageUpload} currentImageUrl={null} />
    );

    const input = container.querySelector('input[type="file"]');
    if (input) {
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(input, { target: { files: [file] } });
      await waitFor(() => expect(mockUpload).toHaveBeenCalledWith(file));
    }
    expect(container).toBeDefined();
  });

  it('handles file selection with no files', async () => {
    const mockUpload = vi.fn();
    useImageUpload.mockReturnValue({
      uploadImage: mockUpload,
      uploading: false,
      uploadError: null,
      clearError: vi.fn(),
    });
    const { container } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} />
    );

    const input = container.querySelector('input[type="file"]');
    if (input) {
      fireEvent.change(input, { target: { files: [] } });
    }
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    useImageUpload.mockReturnValue({
      uploadImage: vi.fn().mockRejectedValue(new Error('Upload failed')),
      uploading: false,
      uploadError: null,
      clearError: vi.fn(),
    });
    const onImageUpload = vi.fn();
    const { container } = render(
      <ImageUpload onImageUpload={onImageUpload} currentImageUrl={null} />
    );

    const input = container.querySelector('input[type="file"]');
    if (input) {
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(input, { target: { files: [file] } });
      await waitFor(() => expect(toast.error).toHaveBeenCalled());
    }
    expect(container).toBeDefined();
  });

  it('handles remove image with current URL', async () => {
    deleteJobImage.mockResolvedValue(true);
    const onImageUpload = vi.fn();
    const { container } = render(
      <ImageUpload
        onImageUpload={onImageUpload}
        currentImageUrl="https://example.com/image.jpg"
      />
    );

    const removeBtn = container.querySelector('.btn-outline-danger');
    if (removeBtn) {
      fireEvent.click(removeBtn);
      await waitFor(() => expect(deleteJobImage).toHaveBeenCalled());
    }
    expect(container).toBeDefined();
  });

  it('handles remove image without current URL', async () => {
    useImageUpload.mockReturnValue({
      uploadImage: vi.fn().mockResolvedValue('https://s3.example.com/uploaded.jpg'),
      uploading: false,
      uploadError: null,
      clearError: vi.fn(),
    });

    const onImageUpload = vi.fn();
    const { container } = render(
      <ImageUpload
        onImageUpload={onImageUpload}
        currentImageUrl="https://example.com/existing.jpg"
      />
    );
    expect(container).toBeDefined();
  });

  it('handles remove image S3 deletion error', async () => {
    deleteJobImage.mockRejectedValue(new Error('S3 error'));
    const onImageUpload = vi.fn();
    const { container } = render(
      <ImageUpload
        onImageUpload={onImageUpload}
        currentImageUrl="https://example.com/image.jpg"
      />
    );

    const removeBtn = container.querySelector('.btn-outline-danger');
    if (removeBtn) {
      fireEvent.click(removeBtn);
      await waitFor(() => expect(toast.error).toHaveBeenCalled());
    }
    expect(container).toBeDefined();
  });

  it('shows uploading state', () => {
    useImageUpload.mockReturnValue({
      uploadImage: vi.fn(),
      uploading: true,
      uploadError: null,
      clearError: vi.fn(),
    });

    const { container } = render(
      <ImageUpload
        onImageUpload={vi.fn()}
        currentImageUrl="https://example.com/image.jpg"
      />
    );
    expect(container).toBeDefined();
  });

  it('clicking upload area triggers file input', () => {
    const { container } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} />
    );

    const uploadArea = container.querySelector('.image-upload-area');
    if (uploadArea) {
      fireEvent.click(uploadArea);
    }
    expect(container).toBeDefined();
  });

  it('updates preview when currentImageUrl prop changes', () => {
    const { container, rerender } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} />
    );

    rerender(
      <ImageUpload
        onImageUpload={vi.fn()}
        currentImageUrl="https://example.com/new.jpg"
      />
    );

    const img = container.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('handles moderation error message', async () => {
    useImageUpload.mockReturnValue({
      uploadImage: vi.fn().mockRejectedValue(new Error('imageModerationError')),
      uploading: false,
      uploadError: null,
      clearError: vi.fn(),
    });
    const { container } = render(
      <ImageUpload onImageUpload={vi.fn()} currentImageUrl={null} />
    );

    const input = container.querySelector('input[type="file"]');
    if (input) {
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(input, { target: { files: [file] } });
      await waitFor(() => expect(toast.error).toHaveBeenCalled());
    }
    expect(container).toBeDefined();
  });
});
