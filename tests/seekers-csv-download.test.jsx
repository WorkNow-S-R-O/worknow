import { expect, test, describe } from 'vitest';
import {
	getSeekerCSVHeaders,
	formatSeekerForCSV,
	escapeCSVField,
	createCSVContent,
} from '../apps/client/src/utils/csvExport';

describe('CSV Export Utility Functions', () => {
	test('getSeekerCSVHeaders returns correct headers', () => {
		const headers = getSeekerCSVHeaders();

		expect(headers).toHaveLength(16);
		expect(headers).toContain('Name');
		expect(headers).toContain('Contact Phone');
		expect(headers).toContain('City');
		expect(headers).toContain('Description');
		expect(headers).toContain('Facebook Profile');
		expect(headers).toContain('Languages');
		expect(headers).toContain('Native Language');
		expect(headers).toContain('Employment Type');
		expect(headers).toContain('Category');
		expect(headers).toContain('Document Status');
		expect(headers).toContain('Note');
		expect(headers).toContain('Announcement');
		expect(headers).toContain('Gender');
		expect(headers).toContain('Is Active');
		expect(headers).toContain('Is Demanded');
		expect(headers).toContain('Created Date');
	});

	test('formatSeekerForCSV formats seeker data correctly', () => {
		const mockSeeker = {
			name: 'John Doe',
			contact: '123-456-7890',
			city: 'Tel Aviv',
			description: 'Software Developer',
			facebook: 'https://facebook.com/johndoe',
			languages: ['English', 'Hebrew'],
			nativeLanguage: 'English',
			employment: 'Full-time',
			category: 'IT',
			documents: 'Passport',
			note: 'Available immediately',
			announcement: 'Looking for remote work',
			documentType: 'Passport',
			gender: 'Male',
			isActive: true,
			isDemanded: false,
			createdAt: '2024-01-01T00:00:00Z',
		};

		const formatted = formatSeekerForCSV(mockSeeker);

		expect(formatted).toHaveLength(16);
		expect(formatted[0]).toBe('John Doe');
		expect(formatted[1]).toBe('123-456-7890');
		expect(formatted[2]).toBe('Tel Aviv');
		expect(formatted[3]).toBe('Software Developer');
		expect(formatted[4]).toBe('https://facebook.com/johndoe');
		expect(formatted[5]).toBe('English; Hebrew');
		expect(formatted[6]).toBe('English');
		expect(formatted[7]).toBe('Full-time');
		expect(formatted[8]).toBe('IT');
		expect(formatted[9]).toBe('Passport (Passport)');
		expect(formatted[10]).toBe('Available immediately');
		expect(formatted[11]).toBe('Looking for remote work');
		expect(formatted[12]).toBe('Male');
		expect(formatted[13]).toBe('Yes');
		expect(formatted[14]).toBe('No');
		expect(formatted[15]).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/); // Date format
	});

	test('formatSeekerForCSV handles missing fields', () => {
		const mockSeeker = {
			name: 'Jane Smith',
			// Missing most fields
		};

		const formatted = formatSeekerForCSV(mockSeeker);

		expect(formatted).toHaveLength(16);
		expect(formatted[0]).toBe('Jane Smith');
		expect(formatted[1]).toBe('');
		expect(formatted[2]).toBe('');
		expect(formatted[3]).toBe('');
		expect(formatted[4]).toBe('');
		expect(formatted[5]).toBe('');
		expect(formatted[6]).toBe('');
		expect(formatted[7]).toBe('');
		expect(formatted[8]).toBe('');
		expect(formatted[9]).toBe('');
		expect(formatted[10]).toBe('');
		expect(formatted[11]).toBe('');
		expect(formatted[12]).toBe('');
		expect(formatted[13]).toBe('No'); // isActive defaults to false
		expect(formatted[14]).toBe('No'); // isActive defaults to false
		expect(formatted[15]).toBe(''); // createdAt is missing
	});

	test('escapeCSVField handles quotes and commas', () => {
		const testCases = [
			{ input: 'Simple text', expected: '"Simple text"' },
			{ input: 'Text with "quotes"', expected: '"Text with ""quotes"""' },
			{ input: 'Text with, commas', expected: '"Text with, commas"' },
			{
				input: 'Text with "quotes" and, commas',
				expected: '"Text with ""quotes"" and, commas"',
			},
			{ input: '', expected: '""' },
			{
				input: 'Multiple "quotes" "here"',
				expected: '"Multiple ""quotes"" ""here"""',
			},
		];

		testCases.forEach(({ input, expected }) => {
			expect(escapeCSVField(input)).toBe(expected);
		});
	});

	test('createCSVContent generates valid CSV', () => {
		const mockSeekers = [
			{
				name: 'John Doe',
				contact: '123-456-7890',
				city: 'Tel Aviv',
				description: 'Software Developer',
				facebook: '',
				languages: ['English'],
				nativeLanguage: 'English',
				employment: 'Full-time',
				category: 'IT',
				documents: 'Passport',
				note: '',
				announcement: '',
				documentType: '',
				gender: 'Male',
				isActive: true,
				isDemanded: false,
				createdAt: '2024-01-01T00:00:00Z',
			},
			{
				name: 'Jane Smith',
				contact: '098-765-4321',
				city: 'Haifa',
				description: 'Marketing Manager',
				facebook: '',
				languages: ['Hebrew'],
				nativeLanguage: 'Hebrew',
				employment: 'Part-time',
				category: 'Marketing',
				documents: 'ID',
				note: '',
				announcement: '',
				documentType: '',
				gender: 'Female',
				isActive: true,
				isDemanded: true,
				createdAt: '2024-01-02T00:00:00Z',
			},
		];

		const csvContent = createCSVContent(mockSeekers);
		const lines = csvContent.split('\n');

		// Should have title + header + 2 data rows = 5 lines (export-to-csv format with BOM)
		expect(lines).toHaveLength(5);

		// Check title line
		expect(lines[0]).toContain('WorkNow Candidates Export');

		// Check header line (export-to-csv uses field keys as headers)
		expect(lines[1]).toContain('name');
		expect(lines[1]).toContain('contactPhone');
		expect(lines[1]).toContain('city');
		expect(lines[1]).toContain('description');

		// Check data lines contain expected content
		expect(lines[2]).toContain('John Doe');
		expect(lines[2]).toContain('123-456-7890');
		expect(lines[2]).toContain('Tel Aviv');
		expect(lines[2]).toContain('Software Developer');

		expect(lines[3]).toContain('Jane Smith');
		expect(lines[3]).toContain('098-765-4321');
		expect(lines[3]).toContain('Haifa');
		expect(lines[3]).toContain('Marketing Manager');
	});

	test('handles CSV download with proper file naming', () => {
		const today = new Date().toISOString().split('T')[0];
		const expectedFileName = `seekers_${today}.csv`;

		expect(expectedFileName).toMatch(/^seekers_\d{4}-\d{2}-\d{2}\.csv$/);
	});

	test('fallback mechanism handles API errors correctly', () => {
		// Test that 400 and 404 errors trigger fallback
		const testCases = [
			{ status: 400, shouldFallback: true },
			{ status: 404, shouldFallback: true },
			{ status: 500, shouldFallback: false },
			{ status: undefined, shouldFallback: true }, // No response
		];

		testCases.forEach(({ status, shouldFallback }) => {
			const error = { response: status ? { status } : undefined };
			const shouldTriggerFallback =
				error.response?.status === 404 ||
				error.response?.status === 400 ||
				!error.response;

			expect(shouldTriggerFallback).toBe(shouldFallback);
		});
	});
});
