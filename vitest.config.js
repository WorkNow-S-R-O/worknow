import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
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
			'bootstrap-icons': resolve(__dirname, './tests/mocks/bootstrap-icons.js'),
			'libs/jobs': resolve(__dirname, './tests/mocks/libs-jobs.js'),
			'libs/utils': resolve(__dirname, './tests/mocks/libs-utils.js'),
		},
	},
	// Add mocks for problematic imports
	define: {
		'process.env.NODE_ENV': '"test"',
	},
});
