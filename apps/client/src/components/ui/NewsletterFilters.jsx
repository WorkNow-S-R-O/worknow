import PropTypes from 'prop-types';
import { useIntlayer } from 'react-intlayer';

const NewsletterFilters = ({
	cities,
	categories,
	selectedCities,
	selectedCategories,
	selectedEmployment,
	selectedDocumentTypes,
	selectedLanguages,
	selectedGender,
	onlyDemanded,
	onCityChange,
	onCategoryChange,
	onEmploymentChange,
	onDocumentTypeChange,
	onLanguageChange,
	onGenderChange,
	onOnlyDemandedChange,
	isSubscribing,
	isUnsubscribing,
	isMobile,
}) => {
	const content = useIntlayer('newsletterModal');

	// Filter options with translations
	const languageOptions = [
		{ value: 'русский', label: content.languageRussian.value },
		{ value: 'украинский', label: content.languageUkrainian.value },
		{ value: 'английский', label: content.languageEnglish.value },
		{ value: 'иврит', label: content.languageHebrew.value },
	];

	const employmentOptions = [
		{ value: 'полная', label: content.employmentFull.value },
		{ value: 'частичная', label: content.employmentPartial.value },
	];

	const documentTypeOptions = [
		{ value: 'Виза Б1', label: content.documentVisaB1.value },
		{ value: 'Виза Б2', label: content.documentVisaB2.value },
		{ value: 'Теудат Зеут', label: content.documentTeudatZehut.value },
		{ value: 'Рабочая виза', label: content.documentWorkVisa.value },
		{ value: 'Другое', label: content.documentOther.value },
	];

	const genderOptions = [
		{ value: 'мужчина', label: content.genderMale.value },
		{ value: 'женщина', label: content.genderFemale.value },
	];

	const renderCheckboxGrid = (items, checkedItems, onChange, prefix) => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: isMobile ? '8px' : '6px',
			}}
		>
			{items.map((item) => (
				<div key={item.id || item.value} className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						id={`${prefix}-${item.id || item.value}`}
						checked={checkedItems.includes(
							item.name || item.label || item.value,
						)}
						onChange={(e) => onChange(item, e.target.checked)}
						disabled={isSubscribing || isUnsubscribing}
						style={{
							transform: 'scale(1.2)',
							zIndex: 10,
							position: 'relative',
						}}
					/>
					<label
						className="form-check-label"
						htmlFor={`${prefix}-${item.id || item.value}`}
						style={{ fontSize: isMobile ? '16px' : '14px' }}
					>
						{item.name || item.label}
					</label>
				</div>
			))}
		</div>
	);

	const renderLanguageCheckboxes = () => (
		<div style={{ marginLeft: '8px' }}>
			{languageOptions.map((option) => (
				<div className="form-check" key={option.value}>
					<input
						className="form-check-input"
						type="checkbox"
						id={`lang-${option.value}`}
						checked={selectedLanguages.includes(option.value)}
						onChange={(e) => onLanguageChange(option.value, e.target.checked)}
						disabled={isSubscribing || isUnsubscribing}
						style={{
							transform: 'scale(1.2)',
							zIndex: 10,
							position: 'relative',
						}}
					/>
					<label
						className="form-check-label"
						htmlFor={`lang-${option.value}`}
						style={{ fontSize: isMobile ? '16px' : '14px' }}
					>
						{option.label}
					</label>
				</div>
			))}
		</div>
	);

	const renderGenderCheckboxes = () => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: isMobile ? '8px' : '6px',
			}}
		>
			{genderOptions.map((option) => (
				<div key={option.value} className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						id={`gender-${option.value}`}
						checked={selectedGender.includes(option.value)}
						onChange={(e) => onGenderChange(option.value, e.target.checked)}
						disabled={isSubscribing || isUnsubscribing}
						style={{
							transform: 'scale(1.2)',
							zIndex: 10,
							position: 'relative',
						}}
					/>
					<label
						className="form-check-label"
						htmlFor={`gender-${option.value}`}
						style={{ fontSize: isMobile ? '16px' : '14px' }}
					>
						{option.label}
					</label>
				</div>
			))}
		</div>
	);

	const renderOnlyDemandedCheckbox = () => (
		<div className="form-check">
			<input
				className="form-check-input"
				type="checkbox"
				id="onlyDemanded"
				checked={onlyDemanded}
				onChange={(e) => onOnlyDemandedChange(e.target.checked)}
				disabled={isSubscribing || isUnsubscribing}
				style={{
					transform: 'scale(1.2)',
					zIndex: 10,
					position: 'relative',
				}}
			/>
			<label
				className="form-check-label"
				htmlFor="onlyDemanded"
				style={{ fontSize: isMobile ? '16px' : '14px' }}
			>
				{content.demanded.value}
			</label>
		</div>
	);

	const renderFilterSection = (
		title,
		children,
		marginBottom = isMobile ? '20px' : '16px',
	) => (
		<div style={{ marginBottom }}>
			<label
				style={{
					fontSize: isMobile ? '16px' : '14px',
					fontWeight: '500',
					marginBottom: '8px',
					display: 'block',
				}}
			>
				{title}
			</label>
			{children}
		</div>
	);

	if (isMobile) {
		// Mobile layout - single column
		return (
			<>
				{renderFilterSection(
					content.city.value,
					renderCheckboxGrid(cities, selectedCities, onCityChange, 'city'),
				)}
				{renderFilterSection(
					content.category.value,
					renderCheckboxGrid(
						categories,
						selectedCategories,
						onCategoryChange,
						'cat',
					),
				)}
				{renderFilterSection(
					content.employment.value,
					renderCheckboxGrid(
						employmentOptions,
						selectedEmployment,
						onEmploymentChange,
						'emp',
					),
				)}
				{renderFilterSection(
					content.documentType.value,
					renderCheckboxGrid(
						documentTypeOptions,
						selectedDocumentTypes,
						onDocumentTypeChange,
						'doc',
					),
				)}
				{renderFilterSection(content.gender.value, renderGenderCheckboxes())}
				{renderFilterSection(
					content.languages.value,
					renderLanguageCheckboxes(),
				)}
				{renderFilterSection('', renderOnlyDemandedCheckbox())}
			</>
		);
	}

	// Desktop layout - two columns
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '24px',
			}}
		>
			{/* Left Column */}
			<div>
				{renderFilterSection(
					content.city.value,
					renderCheckboxGrid(cities, selectedCities, onCityChange, 'city'),
				)}
				{renderFilterSection(
					content.category.value,
					renderCheckboxGrid(
						categories,
						selectedCategories,
						onCategoryChange,
						'cat',
					),
				)}
				{renderFilterSection(
					content.employment.value,
					renderCheckboxGrid(
						employmentOptions,
						selectedEmployment,
						onEmploymentChange,
						'emp',
					),
				)}
				{renderFilterSection(
					content.documentType.value,
					renderCheckboxGrid(
						documentTypeOptions,
						selectedDocumentTypes,
						onDocumentTypeChange,
						'doc',
					),
				)}
			</div>

			{/* Right Column */}
			<div>
				{renderFilterSection(content.gender.value, renderGenderCheckboxes())}
				{renderFilterSection(
					content.languages.value,
					renderLanguageCheckboxes(),
				)}
				{renderFilterSection('', renderOnlyDemandedCheckbox())}
			</div>
		</div>
	);
};

NewsletterFilters.propTypes = {
	cities: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	selectedCities: PropTypes.array.isRequired,
	selectedCategories: PropTypes.array.isRequired,
	selectedEmployment: PropTypes.array.isRequired,
	selectedDocumentTypes: PropTypes.array.isRequired,
	selectedLanguages: PropTypes.array.isRequired,
	selectedGender: PropTypes.array.isRequired,
	onlyDemanded: PropTypes.bool.isRequired,
	onCityChange: PropTypes.func.isRequired,
	onCategoryChange: PropTypes.func.isRequired,
	onEmploymentChange: PropTypes.func.isRequired,
	onDocumentTypeChange: PropTypes.func.isRequired,
	onLanguageChange: PropTypes.func.isRequired,
	onGenderChange: PropTypes.func.isRequired,
	onOnlyDemandedChange: PropTypes.func.isRequired,
	isSubscribing: PropTypes.bool.isRequired,
	isUnsubscribing: PropTypes.bool.isRequired,
	isMobile: PropTypes.bool.isRequired,
};

export default NewsletterFilters;
