import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globalSetup: ['./tests/global-setup.js'],
		globals: true,
		setupFiles: ['./tests/setup.jsx'],
		css: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: [
				'apps/client/src/**/*.{js,jsx,ts,tsx}',
				'apps/api/**/*.{js,jsx,ts,tsx}',
				'libs/**/*.{js,jsx,ts,tsx}',
			],
			exclude: [
				'node_modules/',
				'tests/',
				'**/*.config.js',
				'**/*.config.ts',
				'coverage/',
				'dist/',
				'build/',
				'prisma/',
				'tools/',
				'.intlayer/',
				'**/*.content.tsx',
				'**/*.content.ts',
				'**/*.d.ts',
				'**/index.ts',
				'**/index.js',
				'apps/api/app.js',
				'apps/api/index.js',
				'apps/api/config/env.js',
				'apps/api/routes/health.js',
				'apps/api/routes/routes.js',
				'apps/api/utils/cron-jobs.js',
				'apps/api/utils/debug-ai-generation.js',
				'apps/api/utils/showCurrentJobTitles.js',
				'apps/api/utils/check-openai-status.js',
				'apps/client/src/main.jsx',
				'apps/client/src/libs/prisma.ts',
			],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './apps/client/src'),
			'@components': resolve(__dirname, './apps/client/src/components'),
			'@pages': resolve(__dirname, './apps/client/src/pages'),
			'@hooks': resolve(__dirname, './apps/client/src/hooks'),
			'@store': resolve(__dirname, './apps/client/src/store'),
			'@utils': resolve(__dirname, './apps/client/src/utils'),
			'@css': resolve(__dirname, './apps/client/src/css'),
			'@mocks': resolve(__dirname, './tests/mocks'),
			'@services': resolve(__dirname, './apps/client/src/services'),
			'bootstrap-icons': resolve(__dirname, './tests/mocks/bootstrap-icons'),
			'@libs': resolve(__dirname, './apps/client/src/libs'),
			'libs': resolve(__dirname, './libs'),
		},
	},
	// Add mocks for problematic imports
	define: {
		'process.env.NODE_ENV': '"test"',
	},
});
