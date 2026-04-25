import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

import { useTranslationHelpers } from '../apps/client/src/utils/translationHelpers.js';

describe('useTranslationHelpers', () => {
  describe('getGenderLabel', () => {
    it('returns empty string for falsy value', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getGenderLabel(null)).toBe('');
      expect(result.current.getGenderLabel('')).toBe('');
      expect(result.current.getGenderLabel(undefined)).toBe('');
    });

    it('returns label for мужчина', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getGenderLabel('мужчина')).toBe('seekerProfileMale');
      expect(result.current.getGenderLabel('male')).toBe('seekerProfileMale');
      expect(result.current.getGenderLabel('МУЖЧИНА')).toBe('seekerProfileMale');
    });

    it('returns label for женщина', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getGenderLabel('женщина')).toBe('seekerProfileFemale');
      expect(result.current.getGenderLabel('female')).toBe('seekerProfileFemale');
    });

    it('returns original value for unknown gender', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getGenderLabel('unknown')).toBe('unknown');
    });
  });

  describe('getEmploymentLabel', () => {
    it('returns empty string for falsy value', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getEmploymentLabel(null)).toBe('');
      expect(result.current.getEmploymentLabel('')).toBe('');
    });

    it('returns label for full-time', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getEmploymentLabel('полная')).toBe('employmentPolnaya');
      expect(result.current.getEmploymentLabel('full-time')).toBe('employmentPolnaya');
      expect(result.current.getEmploymentLabel('fulltime')).toBe('employmentPolnaya');
    });

    it('returns label for part-time', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getEmploymentLabel('частичная')).toBe('employmentChastichnaya');
      expect(result.current.getEmploymentLabel('part-time')).toBe('employmentChastichnaya');
      expect(result.current.getEmploymentLabel('parttime')).toBe('employmentChastichnaya');
    });

    it('returns original value for unknown employment', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getEmploymentLabel('unknown')).toBe('unknown');
    });
  });

  describe('getCategoryLabel', () => {
    it('returns empty string for falsy value', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getCategoryLabel(null)).toBe('');
    });

    const categoryCases = [
      ['общепит', 'categoryObschepit'],
      ['public catering', 'categoryObschepit'],
      ['стройка', 'categoryStroika'],
      ['construction', 'categoryStroika'],
      ['плотник', 'categoryPlotnik'],
      ['carpenter', 'categoryPlotnik'],
      ['сварщик', 'categorySvarshchik'],
      ['welder', 'categorySvarshchik'],
      ['электрик', 'categoryElektrik'],
      ['electrician', 'categoryElektrik'],
      ['ремонт', 'categoryRemont'],
      ['repair', 'categoryRemont'],
      ['перевозка', 'categoryPerevozka'],
      ['transportation', 'categoryPerevozka'],
      ['доставка', 'categoryDostavka'],
      ['delivery', 'categoryDostavka'],
      ['транспорт', 'categoryTransport'],
      ['transport', 'categoryTransport'],
      ['склад', 'categorySklad'],
      ['warehouse', 'categorySklad'],
      ['завод', 'categoryZavod'],
      ['factory', 'categoryZavod'],
      ['производство', 'categoryProizvodstvo'],
      ['production', 'categoryProizvodstvo'],
      ['торговля', 'categoryTorgovlya'],
      ['trade', 'categoryTorgovlya'],
      ['офис', 'categoryOfis'],
      ['office', 'categoryOfis'],
      ['гостиницы', 'categoryGostinitsy'],
      ['hotels', 'categoryGostinitsy'],
      ['уборка', 'categoryUborka'],
      ['cleaning', 'categoryUborka'],
      ['медицина', 'categoryMeditsina'],
      ['medicine', 'categoryMeditsina'],
      ['здоровье', 'categoryZdorove'],
      ['healthcare', 'categoryZdorove'],
      ['образование', 'categoryObrazovanie'],
      ['education', 'categoryObrazovanie'],
      ['няни', 'categoryNyani'],
      ['babysitting', 'categoryNyani'],
      ['охрана', 'categoryOkhrana'],
      ['security', 'categoryOkhrana'],
      ['бьюти-индустрия', 'categoryByuti'],
      ['beauty industry', 'categoryByuti'],
      ['автосервис', 'categoryAvtoservis'],
      ['auto service', 'categoryAvtoservis'],
    ];

    categoryCases.forEach(([input, expectedKey]) => {
      it(`maps "${input}" to ${expectedKey}`, () => {
        const { result } = renderHook(() => useTranslationHelpers());
        expect(result.current.getCategoryLabel(input)).toBe(expectedKey);
      });
    });

    it('returns original value for unknown category', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getCategoryLabel('Unknown Category')).toBe('Unknown Category');
    });
  });

  describe('getLangLabel', () => {
    it('returns empty string for falsy value', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getLangLabel(null)).toBe('');
    });

    const langCases = [
      ['русский', 'langRusskiy'],
      ['russian', 'langRusskiy'],
      ['английский', 'langAngliyskiy'],
      ['english', 'langAngliyskiy'],
      ['иврит', 'langIvrit'],
      ['hebrew', 'langIvrit'],
      ['украинский', 'langUkrainskiy'],
      ['ukrainian', 'langUkrainskiy'],
      ['арабский', 'langArabskiy'],
      ['arabic', 'langArabskiy'],
    ];

    langCases.forEach(([input, expectedKey]) => {
      it(`maps "${input}" to ${expectedKey}`, () => {
        const { result } = renderHook(() => useTranslationHelpers());
        expect(result.current.getLangLabel(input)).toBe(expectedKey);
      });
    });

    it('returns original value for unknown language', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getLangLabel('chinese')).toBe('chinese');
    });
  });

  describe('getDocumentTypeLabel', () => {
    it('returns empty string for falsy value', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getDocumentTypeLabel(null)).toBe('');
    });

    const docCases = [
      ['Виза Б1', 'documentVisaB1'],
      ['visa b1', 'documentVisaB1'],
      ['Виза Б2', 'documentVisaB2'],
      ['visa b2', 'documentVisaB2'],
      ['Теудат Зеут', 'documentTeudatZehut'],
      ['teudat zehut', 'documentTeudatZehut'],
      ['Рабочая виза', 'documentWorkVisa'],
      ['work visa', 'documentWorkVisa'],
      ['Другое', 'documentOther'],
      ['other', 'documentOther'],
    ];

    docCases.forEach(([input, expectedKey]) => {
      it(`maps "${input}" to ${expectedKey}`, () => {
        const { result } = renderHook(() => useTranslationHelpers());
        expect(result.current.getDocumentTypeLabel(input)).toBe(expectedKey);
      });
    });

    it('returns original value for unknown doc type', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getDocumentTypeLabel('Some doc')).toBe('Some doc');
    });
  });

  describe('getCityLabel', () => {
    it('returns empty string for falsy value', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getCityLabel(null)).toBe('');
    });

    const cityCases = [
      ['Ашкелон', 'cityAshkelon'],
      ['ashkelon', 'cityAshkelon'],
      ['Тель-Авив', 'cityTelAviv'],
      ['tel aviv', 'cityTelAviv'],
      ['Иерусалим', 'cityJerusalem'],
      ['jerusalem', 'cityJerusalem'],
      ['Хайфа', 'cityHaifa'],
      ['haifa', 'cityHaifa'],
      ['Ашдод', 'cityAshdod'],
      ['ashdod', 'cityAshdod'],
      ['Ришон-ле-Цион', 'cityRishonLeTsion'],
      ['rishon lezion', 'cityRishonLeTsion'],
      ['Петах-Тиква', 'cityPetahTikva'],
      ['petah tikva', 'cityPetahTikva'],
      ['Холон', 'cityHolon'],
      ['holon', 'cityHolon'],
      ['Рамат-Ган', 'cityRamatGan'],
      ['ramat gan', 'cityRamatGan'],
      ['Гиватаим', 'cityGivatayim'],
      ['givatayim', 'cityGivatayim'],
      ['Кфар-Саба', 'cityKfarSaba'],
      ['kfar saba', 'cityKfarSaba'],
      ['Беэр-Шева', 'cityBeerSheva'],
      ['beer sheva', 'cityBeerSheva'],
      ['Нетания', 'cityNetanya'],
      ['netanya', 'cityNetanya'],
      ['Герцлия', 'cityHerzliya'],
      ['herzliya', 'cityHerzliya'],
      ['Раанана', 'cityRaanana'],
      ['raanana', 'cityRaanana'],
      ['Модиин', 'cityModiin'],
      ['modiin', 'cityModiin'],
      ['Рош-ха-Аин', 'cityRoshHaayin'],
      ['rosh haayin', 'cityRoshHaayin'],
      ['Явне', 'cityYavne'],
      ['yavne', 'cityYavne'],
      ['Рамла', 'cityRamla'],
      ['ramla', 'cityRamla'],
      ['Лод', 'cityLod'],
      ['lod', 'cityLod'],
      ['Назарет', 'cityNazareth'],
      ['nazareth', 'cityNazareth'],
      ['Акко', 'cityAcre'],
      ['acre', 'cityAcre'],
      ['Тверия', 'cityTiberias'],
      ['tiberias', 'cityTiberias'],
      ['Цфат', 'citySafed'],
      ['safed', 'citySafed'],
      ['Эйлат', 'cityEilat'],
      ['eilat', 'cityEilat'],
    ];

    cityCases.forEach(([input, expectedKey]) => {
      it(`maps "${input}" to ${expectedKey}`, () => {
        const { result } = renderHook(() => useTranslationHelpers());
        expect(result.current.getCityLabel(input)).toBe(expectedKey);
      });
    });

    it('returns original value for unknown city', () => {
      const { result } = renderHook(() => useTranslationHelpers());
      expect(result.current.getCityLabel('Unknown City')).toBe('Unknown City');
    });
  });
});
