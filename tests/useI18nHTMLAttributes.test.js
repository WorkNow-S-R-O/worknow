import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
	defaultLocale,
	rtlLocale,
	autoLocale,
} from '@mocks/useI18nHTMLAttributes.js';

const hookAlias = '@hooks/useI18nHTMLAttributes.tsx';
const hookPath = '../apps/client/src/hooks/useI18nHTMLAttributes.tsx';

const loadHook = async ({ locale, textDir }) => {
	vi.resetModules();

	const getHTMLTextDirMock = vi.fn(() => textDir);

	vi.doMock('react-intlayer', () => ({
		useLocale: () => ({ locale }),
	}));

	vi.doMock('intlayer', () => ({
		getHTMLTextDir: getHTMLTextDirMock,
	}));

	const module = await import(hookAlias);
	const hook = module.useI18nHTMLAttributes || module.default;

	if (typeof hook !== 'function') {
		throw new Error('useI18nHTMLAttributes hook not found');
	}

	return {
		useI18nHTMLAttributes: hook,
		getHTMLTextDirMock,
	};
};

describe('useI18nHTMLAttributes', () => {
	const mockPaths = ['react-intlayer', 'intlayer', hookPath, hookAlias];

	beforeEach(() => {
		document.documentElement.lang = '';
		document.documentElement.dir = '';
		document
			.querySelectorAll('#bootstrap-css, link[href*="bootstrap"]')
			.forEach((node) => node.remove());
	});

	afterEach(() => {
		mockPaths.forEach((path) => {
			try {
				vi.doUnmock(path);
			} catch {}
		});
	});

	it('sets lang and dir attributes and loads the LTR Bootstrap stylesheet', async () => {
		const { useI18nHTMLAttributes, getHTMLTextDirMock } = await loadHook({
			locale: defaultLocale,
			textDir: 'ltr',
		});

		renderHook(() => useI18nHTMLAttributes());

		expect(document.documentElement.lang).toBe(defaultLocale);
		expect(document.documentElement.dir).toBe('ltr');
		expect(getHTMLTextDirMock).toHaveBeenCalledWith(defaultLocale);

		const link = document.getElementById('bootstrap-css');
		expect(link).not.toBeNull();
		expect(link?.getAttribute('href')).toContain('bootstrap.min.css');
		expect(link?.getAttribute('href')).not.toContain('.rtl');
	});

	it('forces RTL direction for Hebrew locales and loads the RTL stylesheet', async () => {
		const { useI18nHTMLAttributes } = await loadHook({
			locale: rtlLocale,
			textDir: 'ltr',
		});

		renderHook(() => useI18nHTMLAttributes());

		expect(document.documentElement.dir).toBe('rtl');

		const link = document.getElementById('bootstrap-css');
		expect(link?.getAttribute('href')).toContain('bootstrap.rtl.min.css');
	});

	it('normalises automatic direction to LTR', async () => {
		const { useI18nHTMLAttributes } = await loadHook({
			locale: autoLocale,
			textDir: 'auto',
		});

		renderHook(() => useI18nHTMLAttributes());

		expect(document.documentElement.dir).toBe('ltr');
	});

	it('removes existing bootstrap links before appending the new stylesheet', async () => {
		const staleLink = document.createElement('link');
		staleLink.href = 'https://cdn.example.com/bootstrap-old.css';
		staleLink.id = 'stale-bootstrap';
		document.head.appendChild(staleLink);

		const otherBootstrapLink = document.createElement('link');
		otherBootstrapLink.href = 'bootstrap-custom.css';
		document.head.appendChild(otherBootstrapLink);

		const { useI18nHTMLAttributes } = await loadHook({
			locale: defaultLocale,
			textDir: 'ltr',
		});

		renderHook(() => useI18nHTMLAttributes());

		const bootstrapLinks = document.querySelectorAll('link[href*="bootstrap"]');
		expect(bootstrapLinks).toHaveLength(1);
		expect(bootstrapLinks[0].id).toBe('bootstrap-css');
	});

	it('removes the injected stylesheet on cleanup', async () => {
		const { useI18nHTMLAttributes } = await loadHook({
			locale: defaultLocale,
			textDir: 'ltr',
		});

		const { unmount } = renderHook(() => useI18nHTMLAttributes());

		expect(document.getElementById('bootstrap-css')).not.toBeNull();

		unmount();

		expect(document.getElementById('bootstrap-css')).toBeNull();
	});
});
