import axios from 'axios';
import { toast } from 'react-hot-toast';
import { mkConfig, generateCsv, download, asString } from 'export-to-csv';

/**
 * CSV Export Utility for Seekers Data using export-to-csv library
 * Provides professional CSV generation with proper Excel compatibility
 */

// Helper function to parse contact field and extract phone number
const parseContactField = (contact) => {
	if (!contact) return { phone: '', facebook: null };

	// Split by comma to separate phone and Facebook
	const parts = contact.split(',').map((part) => part.trim());

	let phone = '';
	let facebook = null;

	parts.forEach((part) => {
		if (part.includes('facebook.com') || part.includes('fb.com')) {
			// Extract Facebook URL
			let fbUrl = part;
			if (!fbUrl.startsWith('http')) {
				fbUrl = 'https://' + fbUrl;
			}
			facebook = fbUrl;
		} else {
			// This is likely a phone number
			phone = part;
		}
	});

	return { phone, facebook };
};

// Helper function to clean and format text
const cleanText = (text) => {
	if (!text) return '';
	return String(text)
		.replace(/\r\n/g, ' ') // Replace line breaks with spaces
		.replace(/\n/g, ' ') // Replace newlines with spaces
		.replace(/\r/g, ' ') // Replace carriage returns with spaces
		.replace(/\s+/g, ' ') // Replace multiple spaces with single space
		.trim(); // Remove leading/trailing whitespace
};

// Helper function to truncate long text for better CSV readability
const truncateText = (text, maxLength = 100) => {
	const cleaned = cleanText(text);
	if (cleaned.length <= maxLength) return cleaned;
	return cleaned.substring(0, maxLength - 3) + '...';
};

// Helper function to format contact info
const formatContact = (contact) => {
	if (!contact) return '';
	const { phone } = parseContactField(contact);
	return cleanText(phone);
};

// Helper function to format languages
const formatLanguages = (languages) => {
	if (!languages) return '';
	if (Array.isArray(languages)) {
		return languages.join('; ');
	}
	return cleanText(languages);
};

// Helper function to format document status
const formatDocumentStatus = (documents, documentType) => {
	const docStatus = cleanText(documents);
	const docType = cleanText(documentType);

	if (docStatus && docType) {
		return `${docStatus} (${docType})`;
	} else if (docStatus) {
		return docStatus;
	} else if (docType) {
		return docType;
	}
	return '';
};

/**
 * Transforms seeker data for CSV export
 * @param {Object} seeker - Seeker object
 * @returns {Object} Formatted seeker object for CSV
 */
const transformSeekerForCSV = (seeker) => {
	return {
		name: cleanText(seeker.name),
		contactPhone: formatContact(seeker.contact),
		city: cleanText(seeker.city),
		description: truncateText(seeker.description, 150),
		facebookProfile: cleanText(seeker.facebook),
		languages: formatLanguages(seeker.languages),
		nativeLanguage: cleanText(seeker.nativeLanguage),
		employmentType: cleanText(seeker.employment),
		category: cleanText(seeker.category),
		documentStatus: truncateText(
			formatDocumentStatus(seeker.documents, seeker.documentType),
			80,
		),
		note: truncateText(seeker.note, 100),
		announcement: truncateText(seeker.announcement, 100),
		gender: cleanText(seeker.gender),
		isActive: seeker.isActive ? 'Yes' : 'No',
		isDemanded: seeker.isDemanded ? 'Yes' : 'No',
		createdDate: seeker.createdAt
			? new Date(seeker.createdAt).toLocaleDateString()
			: '',
	};
};

/**
 * Downloads CSV file from API endpoint or creates fallback CSV
 * @param {Object} options - Configuration options
 * @param {boolean} options.isPremium - Whether user has premium access
 * @param {Object} options.filters - Filter options (days, etc.)
 * @param {Array} options.seekers - Current seekers data for fallback
 * @param {Function} options.startLoadingWithProgress - Loading function
 * @param {Function} options.completeLoading - Complete loading function
 * @param {Object} options.content - Internationalization content
 * @param {string} options.apiUrl - API base URL
 */
export const downloadSeekersCSV = async ({
	isPremium,
	filters = {},
	seekers = [],
	startLoadingWithProgress,
	completeLoading,
	content,
	apiUrl,
}) => {
	try {
		// Check if user has premium access
		if (!isPremium) {
			toast.error(
				content.premiumRequired?.value ||
					'Premium subscription required for CSV download',
			);
			return;
		}

		startLoadingWithProgress();

		// Try to fetch from API first
		try {
			let apiParams = { ...filters };

			// If downloading all candidates, fetch all pages
			if (filters.downloadAll) {
				apiParams = {
					...filters,
					limit: 10000, // Large limit to get all seekers
					page: 1,
				};
			}

			const response = await axios.get(`${apiUrl}/api/seekers/export`, {
				params: apiParams,
				timeout: 60000, // Increased timeout for large datasets
			});

			if (response.data && response.data.length > 0) {
				// Transform data for CSV
				const transformedData = response.data.map(transformSeekerForCSV);

				// Create CSV configuration with Excel compatibility
				const csvConfig = mkConfig({
					filename: `seekers_${new Date().toISOString().split('T')[0]}`,
					useKeysAsHeaders: true,
					useBom: true, // Required by Excel for proper UTF-8 display
					quoteStrings: true, // Quote all strings for better Excel compatibility
					fieldSeparator: ',',
					showTitle: true,
					title: filters.downloadAll
						? 'WorkNow All Candidates Export'
						: 'WorkNow Candidates Export',
					showColumnHeaders: true,
					columnHeaders: [
						{ key: 'name', displayLabel: 'Name' },
						{ key: 'contactPhone', displayLabel: 'Contact Phone' },
						{ key: 'city', displayLabel: 'City' },
						{ key: 'description', displayLabel: 'Description' },
						{ key: 'facebookProfile', displayLabel: 'Facebook Profile' },
						{ key: 'languages', displayLabel: 'Languages' },
						{ key: 'nativeLanguage', displayLabel: 'Native Language' },
						{ key: 'employmentType', displayLabel: 'Employment Type' },
						{ key: 'category', displayLabel: 'Category' },
						{ key: 'documentStatus', displayLabel: 'Document Status' },
						{ key: 'note', displayLabel: 'Note' },
						{ key: 'announcement', displayLabel: 'Announcement' },
						{ key: 'gender', displayLabel: 'Gender' },
						{ key: 'isActive', displayLabel: 'Is Active' },
						{ key: 'isDemanded', displayLabel: 'Is Demanded' },
						{ key: 'createdDate', displayLabel: 'Created Date' },
					],
				});

				// Generate and download CSV
				const csvOutput = generateCsv(csvConfig)(transformedData);
				download(csvConfig)(csvOutput);

				const message = filters.downloadAll
					? `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (All ${transformedData.length} candidates)`
					: filters.days
						? `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (Last ${filters.days} days - ${transformedData.length} candidates)`
						: `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (${transformedData.length} candidates)`;
				toast.success(message);
			} else {
				throw new Error('No data received from API');
			}
		} catch (error) {
			console.log('API call failed, using fallback CSV generation');
			console.log('Available seekers:', seekers.length);
			console.log('Filters:', filters);

			// If downloadAll is true but API failed, try to fetch all seekers from regular endpoint
			if (filters.downloadAll && seekers.length === 0) {
				try {
					console.log(
						'Attempting to fetch all seekers from regular API endpoint...',
					);
					const allSeekersResponse = await axios.get(`${apiUrl}/api/seekers`, {
						params: {
							limit: 10000,
							page: 1,
						},
						timeout: 60000,
					});

					if (allSeekersResponse.data && allSeekersResponse.data.length > 0) {
						console.log(
							`Fetched ${allSeekersResponse.data.length} seekers from regular API`,
						);
						createCSVFromCurrentData(allSeekersResponse.data, content, filters);
						return;
					}
				} catch (fallbackError) {
					console.log('Fallback API call also failed:', fallbackError);
				}
			}

			if (seekers.length === 0) {
				toast.error(
					content.noSeekersToExport?.value ||
						'No seekers data available to export',
				);
				return;
			}

			// Use fallback: generate CSV from current data
			createCSVFromCurrentData(seekers, content, filters);
		}
	} catch (error) {
		console.error('CSV download error:', error);
		toast.error(
			content.csvDownloadError?.value || 'Error downloading CSV file',
		);
	} finally {
		completeLoading();
	}
};

/**
 * Creates CSV from current seekers data (fallback method)
 * @param {Array} seekers - Array of seeker objects
 * @param {Object} content - Internationalization content
 * @param {Object} filters - Filter options
 */
export const createCSVFromCurrentData = (seekers, content, filters = {}) => {
	try {
		if (!seekers || seekers.length === 0) {
			toast.error(
				content.noSeekersToExport?.value ||
					'No seekers data available to export',
			);
			return;
		}

		let filteredSeekers = seekers;
		if (filters.days) {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - filters.days);
			filteredSeekers = seekers.filter((seeker) => {
				const createdAt = new Date(seeker.createdAt);
				return createdAt >= cutoffDate;
			});
		}

		if (filteredSeekers.length === 0) {
			toast.error(
				content.noSeekersInDateRange?.value ||
					'No seekers found in the specified date range',
			);
			return;
		}

		// Transform data for CSV
		const transformedData = filteredSeekers.map(transformSeekerForCSV);

		// Create CSV configuration with Excel compatibility
		const csvConfig = mkConfig({
			filename: `seekers_${new Date().toISOString().split('T')[0]}`,
			useKeysAsHeaders: true,
			useBom: true, // Required by Excel for proper UTF-8 display
			quoteStrings: true, // Quote all strings for better Excel compatibility
			fieldSeparator: ',',
			showTitle: true,
			title: filters.downloadAll
				? 'WorkNow All Candidates Export (Fallback)'
				: 'WorkNow Candidates Export (Current Page Data)',
			showColumnHeaders: true,
			columnHeaders: [
				{ key: 'name', displayLabel: 'Name' },
				{ key: 'contactPhone', displayLabel: 'Contact Phone' },
				{ key: 'city', displayLabel: 'City' },
				{ key: 'description', displayLabel: 'Description' },
				{ key: 'facebookProfile', displayLabel: 'Facebook Profile' },
				{ key: 'languages', displayLabel: 'Languages' },
				{ key: 'nativeLanguage', displayLabel: 'Native Language' },
				{ key: 'employmentType', displayLabel: 'Employment Type' },
				{ key: 'category', displayLabel: 'Category' },
				{ key: 'documentStatus', displayLabel: 'Document Status' },
				{ key: 'note', displayLabel: 'Note' },
				{ key: 'announcement', displayLabel: 'Announcement' },
				{ key: 'gender', displayLabel: 'Gender' },
				{ key: 'isActive', displayLabel: 'Is Active' },
				{ key: 'isDemanded', displayLabel: 'Is Demanded' },
				{ key: 'createdDate', displayLabel: 'Created Date' },
			],
		});

		// Generate and download CSV
		const csvOutput = generateCsv(csvConfig)(transformedData);
		download(csvConfig)(csvOutput);

		const message = filters.downloadAll
			? `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (All ${transformedData.length} candidates - Fallback)`
			: filters.days
				? `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (Last ${filters.days} days - ${transformedData.length} candidates)`
				: Object.keys(filters).length === 0
					? `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (Current page data - API unavailable - ${transformedData.length} candidates)`
					: `${content.csvDownloadSuccess?.value || 'CSV file downloaded successfully!'} (Filtered results - ${transformedData.length} candidates)`;
		toast.success(message);
	} catch (error) {
		console.error('CSV generation error:', error);
		toast.error(content.csvDownloadError?.value || 'Error generating CSV file');
	}
};

// Legacy functions for backward compatibility (kept for tests)
export const formatSeekerForCSV = (seeker) => {
	const transformed = transformSeekerForCSV(seeker);
	return Object.values(transformed);
};

export const getSeekerCSVHeaders = () => {
	return [
		'Name',
		'Contact Phone',
		'City',
		'Description',
		'Facebook Profile',
		'Languages',
		'Native Language',
		'Employment Type',
		'Category',
		'Document Status',
		'Note',
		'Announcement',
		'Gender',
		'Is Active',
		'Is Demanded',
		'Created Date',
	];
};

export const escapeCSVField = (field) => {
	return `"${String(field).replace(/"/g, '""')}"`;
};

export const createCSVContent = (seekers) => {
	const transformedData = seekers.map(transformSeekerForCSV);
	const csvConfig = mkConfig({
		useKeysAsHeaders: true,
		useBom: true,
		quoteStrings: true,
		showTitle: true,
		title: 'WorkNow Candidates Export',
	});
	const csvOutput = generateCsv(csvConfig)(transformedData);
	return asString(csvOutput);
};
