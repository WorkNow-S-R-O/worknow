import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import axios from 'axios';
import {
  createJob,
  createJobWithImage,
  updateJob,
  updateJobImage,
  deleteJobImage,
} from '../apps/client/src/libs/jobs.js';

describe('jobs lib', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createJob', () => {
    it('creates a job without token', async () => {
      axios.post.mockResolvedValue({ data: { id: 1, title: 'Test Job' } });
      const result = await createJob({ title: 'Test Job', salary: 50 }, null);
      expect(result).toEqual({ id: 1, title: 'Test Job' });
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/jobs'),
        { title: 'Test Job', salary: 50 },
        expect.any(Object)
      );
    });

    it('creates a job with token', async () => {
      axios.post.mockResolvedValue({ data: { id: 1, title: 'Test Job' } });
      const result = await createJob({ title: 'Test Job' }, 'my-token');
      expect(result).toEqual({ id: 1, title: 'Test Job' });
      const callArgs = axios.post.mock.calls[0];
      expect(callArgs[2].headers.Authorization).toBe('Bearer my-token');
    });

    it('throws when API fails', async () => {
      axios.post.mockRejectedValue(new Error('API error'));
      await expect(createJob({ title: 'Test' }, 'token')).rejects.toThrow('API error');
    });
  });

  describe('createJobWithImage', () => {
    it('creates a job with image without token', async () => {
      axios.post.mockResolvedValue({ data: { id: 1, imageUrl: 'https://s3.example.com/img.jpg' } });
      const formData = new FormData();
      formData.append('title', 'Test Job');
      const result = await createJobWithImage(formData, null);
      expect(result).toEqual({ id: 1, imageUrl: 'https://s3.example.com/img.jpg' });
    });

    it('creates a job with image with token', async () => {
      axios.post.mockResolvedValue({ data: { id: 1 } });
      const formData = new FormData();
      const result = await createJobWithImage(formData, 'my-token');
      const callArgs = axios.post.mock.calls[0];
      expect(callArgs[2].headers.Authorization).toBe('Bearer my-token');
    });

    it('throws when API fails', async () => {
      axios.post.mockRejectedValue(new Error('Upload failed'));
      await expect(createJobWithImage(new FormData(), 'token')).rejects.toThrow();
    });
  });

  describe('updateJob', () => {
    it('updates a job without token', async () => {
      axios.put.mockResolvedValue({ data: { id: 1, title: 'Updated Job' } });
      const result = await updateJob(1, { title: 'Updated Job' }, null);
      expect(result).toEqual({ id: 1, title: 'Updated Job' });
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/jobs/1'),
        { title: 'Updated Job' },
        expect.any(Object)
      );
    });

    it('updates a job with token', async () => {
      axios.put.mockResolvedValue({ data: { id: 1 } });
      await updateJob(1, { title: 'Test' }, 'my-token');
      const callArgs = axios.put.mock.calls[0];
      expect(callArgs[2].headers.Authorization).toBe('Bearer my-token');
    });

    it('throws when API fails', async () => {
      axios.put.mockRejectedValue(new Error('Update failed'));
      await expect(updateJob(1, {}, 'token')).rejects.toThrow();
    });
  });

  describe('updateJobImage', () => {
    it('updates job image without token', async () => {
      axios.put.mockResolvedValue({ data: { imageUrl: 'https://s3.example.com/new.jpg' } });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      const result = await updateJobImage(1, file, null);
      expect(result).toEqual({ imageUrl: 'https://s3.example.com/new.jpg' });
    });

    it('updates job image with token', async () => {
      axios.put.mockResolvedValue({ data: {} });
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await updateJobImage(1, file, 'my-token');
      const callArgs = axios.put.mock.calls[0];
      expect(callArgs[2].headers.Authorization).toBe('Bearer my-token');
    });

    it('throws when API fails', async () => {
      axios.put.mockRejectedValue(new Error('Image update failed'));
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await expect(updateJobImage(1, file, 'token')).rejects.toThrow();
    });
  });

  describe('deleteJobImage', () => {
    it('deletes job image without token', async () => {
      axios.delete.mockResolvedValue({ data: { success: true } });
      const result = await deleteJobImage('https://s3.example.com/image.jpg', null);
      expect(result).toEqual({ success: true });
    });

    it('deletes job image with token', async () => {
      axios.delete.mockResolvedValue({ data: { success: true } });
      await deleteJobImage('https://s3.example.com/image.jpg', 'my-token');
      const callArgs = axios.delete.mock.calls[0];
      expect(callArgs[1].headers.Authorization).toBe('Bearer my-token');
    });

    it('throws when API fails', async () => {
      axios.delete.mockRejectedValue(new Error('Delete failed'));
      await expect(deleteJobImage('https://s3.example.com/image.jpg', 'token')).rejects.toThrow();
    });
  });
});
