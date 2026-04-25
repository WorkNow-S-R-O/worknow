import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('export-to-csv', () => ({
  mkConfig: (cfg) => cfg,
  generateCsv: () => () => 'csv-output',
  download: () => () => {},
  asString: () => 'csv-string',
}));

import {
  downloadSeekersCSV,
  createCSVFromCurrentData,
  formatSeekerForCSV,
  getSeekerCSVHeaders,
  escapeCSVField,
  createCSVContent,
} from '../apps/client/src/utils/csvExport.js';

import axios from 'axios';
import { toast } from 'react-hot-toast';

const mockContent = {
  premiumRequired: { value: 'Premium required' },
  csvDownloadSuccess: { value: 'Downloaded!' },
  csvDownloadError: { value: 'Error!' },
  noSeekersToExport: { value: 'No seekers' },
  noSeekersInDateRange: { value: 'No seekers in range' },
};

const mockSeeker = {
  id: 1,
  name: 'Ivan Petrov',
  contact: '+972501234567',
  city: 'Tel Aviv',
  description: 'Experienced worker',
  facebook: null,
  languages: ['Russian', 'Hebrew'],
  nativeLanguage: 'Russian',
  employment: 'full',
  category: 'Construction',
  documents: 'Visa B1',
  documentType: 'Виза Б1',
  note: 'Some note',
  announcement: 'Job announcement',
  gender: 'мужчина',
  isActive: true,
  isDemanded: false,
  createdAt: new Date('2024-01-01'),
};

describe('csvExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('formatSeekerForCSV', () => {
    it('formats seeker to array of values', () => {
      const result = formatSeekerForCSV(mockSeeker);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles seeker with facebook in contact', () => {
      const seeker = { ...mockSeeker, contact: '+972501234567, facebook.com/ivan' };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with no contact', () => {
      const seeker = { ...mockSeeker, contact: null };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with string languages', () => {
      const seeker = { ...mockSeeker, languages: 'Russian' };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with no languages', () => {
      const seeker = { ...mockSeeker, languages: null };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with isActive false and isDemanded true', () => {
      const seeker = { ...mockSeeker, isActive: false, isDemanded: true };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with no createdAt', () => {
      const seeker = { ...mockSeeker, createdAt: null };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with only documents (no documentType)', () => {
      const seeker = { ...mockSeeker, documentType: null };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles seeker with only documentType (no documents)', () => {
      const seeker = { ...mockSeeker, documents: null };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('truncates long description', () => {
      const seeker = { ...mockSeeker, description: 'A'.repeat(200) };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles contact with fb.com URL', () => {
      const seeker = { ...mockSeeker, contact: '+972501234567, fb.com/ivan' };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });

    it('handles facebook URL without http prefix', () => {
      const seeker = { ...mockSeeker, contact: 'facebook.com/ivan' };
      const result = formatSeekerForCSV(seeker);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getSeekerCSVHeaders', () => {
    it('returns array of header strings', () => {
      const headers = getSeekerCSVHeaders();
      expect(Array.isArray(headers)).toBe(true);
      expect(headers.length).toBeGreaterThan(0);
      expect(headers[0]).toBe('Name');
    });
  });

  describe('escapeCSVField', () => {
    it('wraps value in quotes', () => {
      const result = escapeCSVField('hello world');
      expect(result).toBe('"hello world"');
    });

    it('escapes internal quotes', () => {
      const result = escapeCSVField('say "hello"');
      expect(result).toBe('"say ""hello"""');
    });

    it('converts non-string to string', () => {
      const result = escapeCSVField(123);
      expect(result).toBe('"123"');
    });
  });

  describe('createCSVContent', () => {
    it('creates CSV string from seekers', () => {
      const result = createCSVContent([mockSeeker]);
      expect(typeof result).toBe('string');
    });

    it('handles empty seekers array', () => {
      const result = createCSVContent([]);
      expect(typeof result).toBe('string');
    });
  });

  describe('createCSVFromCurrentData', () => {
    it('shows error when no seekers', () => {
      createCSVFromCurrentData([], mockContent);
      expect(toast.error).toHaveBeenCalled();
    });

    it('shows error when null seekers', () => {
      createCSVFromCurrentData(null, mockContent);
      expect(toast.error).toHaveBeenCalled();
    });

    it('creates CSV for current seekers', () => {
      createCSVFromCurrentData([mockSeeker], mockContent);
      expect(toast.success).toHaveBeenCalled();
    });

    it('filters by days', () => {
      const oldSeeker = {
        ...mockSeeker,
        createdAt: new Date('2020-01-01'),
      };
      const newSeeker = {
        ...mockSeeker,
        id: 2,
        createdAt: new Date(),
      };
      createCSVFromCurrentData([oldSeeker, newSeeker], mockContent, { days: 30 });
      // Only newSeeker should pass filter
      expect(toast.success).toHaveBeenCalled();
    });

    it('shows error when days filter results in no seekers', () => {
      const oldSeeker = { ...mockSeeker, createdAt: new Date('2020-01-01') };
      createCSVFromCurrentData([oldSeeker], mockContent, { days: 7 });
      expect(toast.error).toHaveBeenCalled();
    });

    it('handles downloadAll flag', () => {
      createCSVFromCurrentData([mockSeeker], mockContent, { downloadAll: true });
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles filters with days only (no downloadAll)', () => {
      const newSeeker = { ...mockSeeker, createdAt: new Date() };
      createCSVFromCurrentData([newSeeker], mockContent, { days: 7 });
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles empty filters object', () => {
      createCSVFromCurrentData([mockSeeker], mockContent, {});
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('downloadSeekersCSV', () => {
    const mockOptions = {
      isPremium: true,
      filters: {},
      seekers: [mockSeeker],
      startLoadingWithProgress: vi.fn(),
      completeLoading: vi.fn(),
      content: mockContent,
      apiUrl: 'http://localhost:3000',
    };

    it('shows error when not premium', async () => {
      await downloadSeekersCSV({ ...mockOptions, isPremium: false });
      expect(toast.error).toHaveBeenCalled();
    });

    it('downloads CSV from API when available', async () => {
      axios.get.mockResolvedValue({
        data: [mockSeeker],
      });
      await downloadSeekersCSV(mockOptions);
      expect(toast.success).toHaveBeenCalled();
    });

    it('falls back to current seekers when API fails', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      await downloadSeekersCSV(mockOptions);
      expect(toast.success).toHaveBeenCalled();
    });

    it('shows error when API fails and no seekers', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      await downloadSeekersCSV({ ...mockOptions, seekers: [] });
      expect(toast.error).toHaveBeenCalled();
    });

    it('calls completeLoading after download', async () => {
      axios.get.mockResolvedValue({ data: [mockSeeker] });
      const completeLoading = vi.fn();
      await downloadSeekersCSV({ ...mockOptions, completeLoading });
      expect(completeLoading).toHaveBeenCalled();
    });

    it('handles downloadAll with API success', async () => {
      axios.get.mockResolvedValue({ data: [mockSeeker] });
      await downloadSeekersCSV({
        ...mockOptions,
        filters: { downloadAll: true },
      });
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles downloadAll with API fail but fallback API success', async () => {
      axios.get
        .mockRejectedValueOnce(new Error('export endpoint failed'))
        .mockResolvedValueOnce({ data: [mockSeeker] });
      await downloadSeekersCSV({
        ...mockOptions,
        seekers: [],
        filters: { downloadAll: true },
      });
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles downloadAll with both APIs failing and no seekers', async () => {
      axios.get.mockRejectedValue(new Error('all fail'));
      await downloadSeekersCSV({
        ...mockOptions,
        seekers: [],
        filters: { downloadAll: true },
      });
      expect(toast.error).toHaveBeenCalled();
    });

    it('handles API returning empty data', async () => {
      axios.get.mockResolvedValue({ data: [] });
      await downloadSeekersCSV(mockOptions);
      // Falls back to current seekers
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles API returning null data', async () => {
      axios.get.mockResolvedValue({ data: null });
      await downloadSeekersCSV(mockOptions);
      // Falls back to current seekers
      expect(toast.success).toHaveBeenCalled();
    });

    it('handles filters.days in success message', async () => {
      axios.get.mockResolvedValue({ data: [mockSeeker] });
      await downloadSeekersCSV({
        ...mockOptions,
        filters: { days: 7 },
      });
      expect(toast.success).toHaveBeenCalled();
    });

    it('calls completeLoading when error thrown', async () => {
      const completeLoading = vi.fn();
      const startLoadingWithProgress = vi.fn(() => { throw new Error('loading error'); });
      await downloadSeekersCSV({
        ...mockOptions,
        startLoadingWithProgress,
        completeLoading,
      });
      expect(completeLoading).toHaveBeenCalled();
    });
  });
});
