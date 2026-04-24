import { describe, it, expect } from 'vitest';
import { containsBadWords, containsLinks } from '../apps/api/middlewares/validation.js';

describe('containsBadWords', () => {
  it('returns false for null/undefined/empty', () => {
    expect(containsBadWords(null)).toBe(false);
    expect(containsBadWords(undefined)).toBe(false);
    expect(containsBadWords('')).toBe(false);
  });

  it('returns false for clean text', () => {
    expect(containsBadWords('Водитель склад')).toBe(false);
  });

  it('returns true for Russian profanity from badWordsList', () => {
    expect(containsBadWords('блядь работа')).toBe(true);
  });
});

describe('containsLinks', () => {
  it('returns false for null/empty', () => {
    expect(containsLinks(null)).toBe(false);
    expect(containsLinks('')).toBe(false);
  });

  it('returns false for plain text', () => {
    expect(containsLinks('Хорошая вакансия')).toBe(false);
  });

  it('returns true for http:// links', () => {
    expect(containsLinks('смотри http://example.com')).toBe(true);
  });

  it('returns true for https:// links', () => {
    expect(containsLinks('подробнее на https://site.ru')).toBe(true);
  });

  it('returns true for www. links', () => {
    expect(containsLinks('зайди на www.site.com')).toBe(true);
  });
});
