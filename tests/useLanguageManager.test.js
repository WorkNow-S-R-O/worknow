import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

const hookAlias = '@hooks/useLanguageManager.js';

const resetStorageMocks = () => {
	localStorage.getItem.mockReset();
	localStorage.setItem.mockReset();
	localStorage.removeItem.mockReset();
	sessionStorage.getItem?.mockReset?.();
};

const setNavigatorLanguage = (value) => {
	Object.defineProperty(navigator, 'language', {
		value,
		configurable: true,
	});
	Object.defineProperty(navigator, 'languages', {
		value: [value],
		configurable: true,
	});
};

const loadHook = async ({
	initialLocale = 'ru',
	savedLanguage = null,
	cookieLanguage = null,
	navigatorLanguage = 'en-US',
} = {}) => {
	vi.resetModules();

	const setLocale = vi.fn();

	vi.doMock('react-intlayer', () => ({
		useLocale: () => ({ locale: initialLocale, setLocale }),
	}));

	resetStorageMocks();
	localStorage.getItem.mockReturnValue(savedLanguage);

	document.cookie = '';
	if (cookieLanguage) {
		document.cookie = `worknow-language=${cookieLanguage}`;
	}

	setNavigatorLanguage(navigatorLanguage);

	const module = await import(hookAlias);
	const useLanguageManager = module.useLanguageManager ?? module.default;
	if (typeof useLanguageManager !== 'function') {
		throw new Error('useLanguageManager export not found');
	}

	return {
		useLanguageManager,
		setLocale,
		restore: () => {},
	};
};

const originalLocation = window.location;
const reloadSpy = vi.fn();
let cookieStore = '';
let cookieGetterSpy;
let cookieSetterSpy;

describe('useLanguageManager', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'location', {
			configurable: true,
			enumerable: true,
			value: { reload: reloadSpy },
		});

		cookieGetterSpy = vi
			.spyOn(document, 'cookie', 'get')
			.mockImplementation(() => cookieStore);
		cookieSetterSpy = vi
			.spyOn(document, 'cookie', 'set')
			.mockImplementation((value) => {
				cookieStore = value;
			});
	});

	beforeEach(() => {
		vi.clearAllMocks();
		cookieStore = '';
	});

	afterEach(() => {
		reloadSpy.mockClear();
		cookieGetterSpy.mockClear();
		cookieSetterSpy.mockClear();
	});

	afterAll(() => {
		cookieGetterSpy.mockRestore();
		cookieSetterSpy.mockRestore();
		Object.defineProperty(window, 'location', {
			configurable: true,
			enumerable: true,
			value: originalLocation,
		});
	});

	it('detects browser language when no preference is saved', async () => {
	const { useLanguageManager, setLocale, restore } = await loadHook({
		navigatorLanguage: 'en-GB',
	});

	try {
		const { result } = renderHook(() => useLanguageManager());

		await waitFor(() => {
			expect(setLocale).toHaveBeenCalledWith('en');
		});

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'worknow-language',
			'en',
		);
		expect(result.current.loadedLanguages).toContain('en');
		expect(result.current.availableLanguages).toHaveLength(5);
	} finally {
		restore();
	}
	});

	it('respects saved language from storage', async () => {
	const { useLanguageManager, setLocale, restore } = await loadHook({
		savedLanguage: 'he',
		initialLocale: 'ru',
	});

	try {
		renderHook(() => useLanguageManager());

		await waitFor(() => {
			expect(setLocale).toHaveBeenCalledWith('he');
		});

		expect(localStorage.setItem).not.toHaveBeenCalled();
	} finally {
		restore();
	}
	});

	it('uses cookie preference when available', async () => {
	const { useLanguageManager, setLocale, restore } = await loadHook({
		cookieLanguage: 'ar',
		initialLocale: 'ru',
	});

	try {
		renderHook(() => useLanguageManager());

		await waitFor(() => {
			expect(setLocale).toHaveBeenCalledWith('ar');
		});
	} finally {
		restore();
	}
	});

	it('changes language and persists preference', async () => {
	const { useLanguageManager, setLocale, restore } = await loadHook({
		savedLanguage: 'ru',
	});

	try {
		const { result } = renderHook(() => useLanguageManager());

		await waitFor(() => {
			expect(setLocale).toHaveBeenCalled();
		});
		setLocale.mockClear();
		reloadSpy.mockClear();

		await act(async () => {
			await result.current.changeLanguage('en');
		});

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'worknow-language',
			'en',
		);
		expect(document.cookie).toMatch(/worknow-language=en/);
		expect(setLocale).toHaveBeenCalledWith('en');
		expect(reloadSpy).toHaveBeenCalled();
	} finally {
		restore();
	}
	});

	it('skips changeLanguage when language is unchanged', async () => {
	const { useLanguageManager, setLocale, restore } =
		await loadHook({ savedLanguage: 'en', initialLocale: 'en' });

	try {
		const { result } = renderHook(() => useLanguageManager());

		await waitFor(() => {
			expect(setLocale).toHaveBeenCalledWith('en');
		});
		setLocale.mockClear();
		reloadSpy.mockClear();

		await act(async () => {
			await result.current.changeLanguage('en');
		});

		expect(setLocale).not.toHaveBeenCalled();
		expect(reloadSpy).not.toHaveBeenCalled();
	} finally {
		restore();
	}
	});

	it('clears language preference and reloads page', async () => {
	const { useLanguageManager, restore } = await loadHook({
		savedLanguage: 'ru',
	});

	try {
		const { result } = renderHook(() => useLanguageManager());
		await waitFor(() => {});

		act(() => {
			result.current.clearLanguagePreference();
		});

		expect(localStorage.removeItem).toHaveBeenCalledWith('worknow-language');
		expect(document.cookie).toMatch(/worknow-language=; expires=Thu, 01 Jan 1970/);
		expect(reloadSpy).toHaveBeenCalled();
	} finally {
		restore();
	}
	});

	it('tracks loaded languages', async () => {
	const { useLanguageManager, restore } = await loadHook({
		savedLanguage: 'ru',
	});

	try {
		const { result } = renderHook(() => useLanguageManager());

		await waitFor(() => {
			expect(result.current.loadedLanguages.length).toBeGreaterThan(0);
		});

		expect(result.current.isLanguageLoaded('ru')).toBe(true);
		expect(result.current.isLanguageLoaded('de')).toBe(false);
	} finally {
		restore();
	}
	});
});
