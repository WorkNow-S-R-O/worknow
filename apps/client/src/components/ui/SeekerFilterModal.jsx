import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntlayer, useLocale } from 'react-intlayer';
import { API_URL } from '@/config';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';
import { useModalBodyLock } from '@/hooks/useModalBodyLock';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { getModalOverlayStyle, getModalContentStyle } from './modalStyles';

const SeekerFilterModal = ({ open, onClose, onApply, currentFilters = {} }) => {
	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCity, setSelectedCity] = useState(currentFilters.city || '');
	const [selectedCategory, setSelectedCategory] = useState(
		currentFilters.category || '',
	);
	const [selectedEmployment, setSelectedEmployment] = useState(
		currentFilters.employment || '',
	);
	const [selectedDocumentType, setSelectedDocumentType] = useState(
		currentFilters.documentType || '',
	);
	const [selectedLanguages, setSelectedLanguages] = useState(
		currentFilters.languages || [],
	);
	const [selectedGender, setSelectedGender] = useState(
		currentFilters.gender || '',
	);
	const [isDemanded, setIsDemanded] = useState(
		currentFilters.isDemanded || false,
	);
	const modalRef = useRef();
	const { locale } = useLocale();
	const content = useIntlayer('seekerFilterModal');


	// Language options with translations
	const languageOptions = [
		{ value: 'русский', label: content.languageRussian.value },
		{ value: 'арабский', label: content.languageArabic.value },
		{ value: 'английский', label: content.languageEnglish.value },
		{ value: 'иврит', label: content.languageHebrew.value },
		{ value: 'украинский', label: content.languageUkrainian.value },
	];

	// Employment options with translations
	const employmentOptions = [
		{ value: 'полная', label: content.employmentFull.value },
		{ value: 'частичная', label: content.employmentPartial.value },
	];

	// Document type options with translations
	const documentTypeOptions = [
		{ value: 'Виза Б1', label: content.documentVisaB1.value },
		{ value: 'Виза Б2', label: content.documentVisaB2.value },
		{ value: 'Теудат Зеут', label: content.documentTeudatZehut.value },
		{ value: 'Рабочая виза', label: content.documentWorkVisa.value },
		{ value: 'Другое', label: content.documentOther.value },
	];

	// Gender options with translations
	const genderOptions = [
		{ value: 'мужчина', label: content.genderMale.value },
		{ value: 'женщина', label: content.genderFemale.value },
	];

	const isMobile = useIsMobile();
	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeToClose({ onClose });
	useModalBodyLock({ isOpen: open, isMobile });
	useOutsideClick({ ref: modalRef, isOpen: open, onClose, isMobile });

	useEffect(() => {
		if (open) {
			setSelectedCity(currentFilters.city || '');
			setSelectedCategory(currentFilters.category || '');
			setSelectedEmployment(currentFilters.employment || '');
			setSelectedDocumentType(currentFilters.documentType || '');
			setSelectedLanguages(currentFilters.languages || []);
			setSelectedGender(currentFilters.gender || '');
			setIsDemanded(currentFilters.isDemanded || false);

			// Fetch cities and categories
			Promise.all([
				fetch(`${API_URL}/api/cities?lang=${locale}`).then((res) => res.json()),
				fetch(`${API_URL}/api/categories?lang=${locale}`).then((res) =>
					res.json(),
				),
			])
				.then(([citiesData, categoriesData]) => {
					console.log('🏙️ Cities data:', citiesData);
					console.log('📂 Categories data:', categoriesData);
					setCities(citiesData);
					setCategories(categoriesData);
				})
				.catch((error) => {
					console.error('❌ Error fetching data:', error);
					setCities([]);
					setCategories([]);
				});
		}
	}, [open, currentFilters, locale]);

	if (!open) return null;

	const handleLanguageChange = (languageValue, checked) => {
		console.log('🗣️ Language change:', languageValue, checked);
		if (checked) {
			setSelectedLanguages((prev) => {
				const newValue = [...prev, languageValue];
				console.log('➕ Adding language, new array:', newValue);
				return newValue;
			});
		} else {
			setSelectedLanguages((prev) => {
				const newValue = prev.filter((lang) => lang !== languageValue);
				console.log('➖ Removing language, new array:', newValue);
				return newValue;
			});
		}
	};

	const handleApply = () => {
		console.log('🔍 Modal state values when applying:', {
			selectedCity,
			selectedCategory,
			selectedEmployment,
			selectedDocumentType,
			selectedLanguages,
			selectedGender,
			isDemanded,
		});

		const filtersToApply = {
			city:
				selectedCity && selectedCity.trim() !== '' ? selectedCity : undefined,
			category:
				selectedCategory && selectedCategory.trim() !== ''
					? selectedCategory
					: undefined,
			employment:
				selectedEmployment && selectedEmployment.trim() !== ''
					? selectedEmployment
					: undefined,
			documentType:
				selectedDocumentType && selectedDocumentType.trim() !== ''
					? selectedDocumentType
					: undefined,
			languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
			gender:
				selectedGender && selectedGender.trim() !== ''
					? selectedGender
					: undefined,
			isDemanded: isDemanded ? true : undefined,
		};

		console.log('🎯 Filters to apply:', filtersToApply);
		onApply(filtersToApply);
		onClose();
	};

	const handleReset = () => {
		setSelectedCity('');
		setSelectedCategory('');
		setSelectedEmployment('');
		setSelectedDocumentType('');
		setSelectedLanguages([]);
		setSelectedGender('');
		setIsDemanded(false);
		onApply({});
		onClose();
	};

	const modalStyle = getModalOverlayStyle(isMobile);
	const contentStyle = getModalContentStyle(isMobile, {
		desktopWidth: 800,
		desktopHeight: 700,
		desktopBorderRadius: 18,
		desktopMaxWidth: '90vw',
		desktopMaxHeight: '90vh',
	});

	const renderCheckbox = (label, checked, onChange, id) => (
		<div className="form-check mb-3" style={{ marginLeft: '8px' }}>
			<input
				className="form-check-input"
				type="checkbox"
				id={id}
				checked={checked}
				onChange={onChange}
				style={{
					transform: 'scale(1.2)',
					zIndex: 10,
					position: 'relative',
				}}
			/>
			<label
				className="form-check-label"
				htmlFor={id}
				style={{ fontSize: isMobile ? '16px' : '14px' }}
			>
				{label}
			</label>
		</div>
	);

	return (
		<div
			style={modalStyle}
			onTouchStart={isMobile ? onTouchStart : undefined}
			onTouchMove={isMobile ? onTouchMove : undefined}
			onTouchEnd={isMobile ? onTouchEnd : undefined}
		>
			<div ref={modalRef} style={contentStyle}>
				{isMobile ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '24px',
						}}
					>
						<h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
							{content.filterModalTitle.value}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
							style={{ fontSize: isMobile ? '24px' : '16px' }}
						></button>
					</div>
				) : (
					<>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
							style={{
								position: 'absolute',
								margin: '5px',
								top: '8px',
								right: '8px',
								fontSize: isMobile ? '24px' : '16px',
							}}
						></button>
						<h5 className="mb-4 font-size-10">
							{content.filterModalTitle.value}
						</h5>
					</>
				)}

				<div style={{ flex: 1, overflowY: 'auto' }}>
					{console.log('🏙️ Cities:', cities)}
					{console.log('📂 Categories:', categories)}
					{console.log('💼 Employment options:', employmentOptions)}
					{console.log('📄 Document type options:', documentTypeOptions)}
					{console.log('👤 Gender options:', genderOptions)}
					{console.log('🗣️ Language options:', languageOptions)}

					{isMobile ? (
						// Mobile layout - single column
						<>
							{/* City Select */}
							<div style={{ marginBottom: '20px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.city.value}
								</label>
								<select
									className="form-select"
									value={selectedCity || ''}
									onChange={(e) => {
										console.log('🏙️ City changed:', e.target.value);
										setSelectedCity(e.target.value);
									}}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								>
									<option value="">{content.chooseCity.value}</option>
									{cities.map((city) => (
										<option key={city.id} value={city.name}>
											{city.name}
										</option>
									))}
								</select>
							</div>

							{/* Category Select */}
							<div style={{ marginBottom: '20px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.category.value}
								</label>
								<select
									className="form-select"
									value={selectedCategory || ''}
									onChange={(e) => {
										console.log('📂 Category changed:', e.target.value);
										setSelectedCategory(e.target.value);
									}}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								>
									<option value="">{content.chooseCategory.value}</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.label || cat.name}>
											{cat.label || cat.name}
										</option>
									))}
								</select>
							</div>

							{/* Employment Select */}
							<div style={{ marginBottom: '20px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.employment.value}
								</label>
								<select
									className="form-select"
									value={selectedEmployment || ''}
									onChange={(e) => {
										console.log('💼 Employment changed:', e.target.value);
										setSelectedEmployment(e.target.value);
									}}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								>
									<option value="">{content.chooseEmployment.value}</option>
									{employmentOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							{/* Document Type Select */}
							<div style={{ marginBottom: '20px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.documentType.value}
								</label>
								<select
									className="form-select"
									value={selectedDocumentType || ''}
									onChange={(e) => {
										console.log('📄 Document type changed:', e.target.value);
										setSelectedDocumentType(e.target.value);
									}}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								>
									<option value="">{content.chooseDocumentType.value}</option>
									{documentTypeOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							{/* Gender Select */}
							<div style={{ marginBottom: '20px' }}>
								<label
									style={{
										fontSize: '16px',
										fontWeight: '500',
										marginBottom: '8px',
										display: 'block',
									}}
								>
									{content.gender.value}
								</label>
								<select
									className="form-select"
									value={selectedGender || ''}
									onChange={(e) => {
										console.log('👤 Gender changed:', e.target.value);
										setSelectedGender(e.target.value);
									}}
									style={{
										fontSize: '16px',
										padding: '12px',
										margin: '0 8px',
										width: '90%',
									}}
								>
									<option value="">{content.chooseGender.value}</option>
									{genderOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							{renderCheckbox(
								content.demanded.value,
								isDemanded,
								(e) => {
									console.log('⭐ Demanded changed:', e.target.checked);
									setIsDemanded(e.target.checked);
								},
								'demandedSwitch',
							)}
						</>
					) : (
						// Desktop layout - two columns
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: '24px',
							}}
						>
							{/* Left Column */}
							<div>
								{/* City Select */}
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											fontSize: '14px',
											fontWeight: '500',
											marginBottom: '8px',
											display: 'block',
										}}
									>
										{content.city.value}
									</label>
									<select
										className="form-select"
										value={selectedCity || ''}
										onChange={(e) => {
											console.log('🏙️ City changed:', e.target.value);
											setSelectedCity(e.target.value);
										}}
										style={{
											fontSize: '14px',
											padding: '8px',
											margin: '0 8px',
											width: '90%',
										}}
									>
										<option value="">{content.chooseCity.value}</option>
										{cities.map((city) => (
											<option key={city.id} value={city.name}>
												{city.name}
											</option>
										))}
									</select>
								</div>

								{/* Category Select */}
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											fontSize: '14px',
											fontWeight: '500',
											marginBottom: '8px',
											display: 'block',
										}}
									>
										{content.category.value}
									</label>
									<select
										className="form-select"
										value={selectedCategory || ''}
										onChange={(e) => {
											console.log('📂 Category changed:', e.target.value);
											setSelectedCategory(e.target.value);
										}}
										style={{
											fontSize: '14px',
											padding: '8px',
											margin: '0 8px',
											width: '90%',
										}}
									>
										<option value="">{content.chooseCategory.value}</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.label || cat.name}>
												{cat.label || cat.name}
											</option>
										))}
									</select>
								</div>

								{/* Employment Select */}
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											fontSize: '14px',
											fontWeight: '500',
											marginBottom: '8px',
											display: 'block',
										}}
									>
										{content.employment.value}
									</label>
									<select
										className="form-select"
										value={selectedEmployment || ''}
										onChange={(e) => {
											console.log('💼 Employment changed:', e.target.value);
											setSelectedEmployment(e.target.value);
										}}
										style={{
											fontSize: '14px',
											padding: '8px',
											margin: '0 8px',
											width: '90%',
										}}
									>
										<option value="">{content.chooseEmployment.value}</option>
										{employmentOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>

								{/* Document Type Select */}
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											fontSize: '14px',
											fontWeight: '500',
											marginBottom: '8px',
											display: 'block',
										}}
									>
										{content.documentType.value}
									</label>
									<select
										className="form-select"
										value={selectedDocumentType || ''}
										onChange={(e) => {
											console.log('📄 Document type changed:', e.target.value);
											setSelectedDocumentType(e.target.value);
										}}
										style={{
											fontSize: '14px',
											padding: '8px',
											margin: '0 8px',
											width: '90%',
										}}
									>
										<option value="">{content.chooseDocumentType.value}</option>
										{documentTypeOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Right Column */}
							<div>
								{/* Gender Select */}
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											fontSize: '14px',
											fontWeight: '500',
											marginBottom: '8px',
											display: 'block',
										}}
									>
										{content.gender.value}
									</label>
									<select
										className="form-select"
										value={selectedGender || ''}
										onChange={(e) => {
											console.log('👤 Gender changed:', e.target.value);
											setSelectedGender(e.target.value);
										}}
										style={{
											fontSize: '14px',
											padding: '8px',
											margin: '0 8px',
											width: '90%',
										}}
									>
										<option value="">{content.chooseGender.value}</option>
										{genderOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>

								{/* Languages Section */}
								<div style={{ marginBottom: '16px' }}>
									<label
										style={{
											fontSize: '14px',
											fontWeight: '500',
											marginBottom: '8px',
											display: 'block',
										}}
									>
										{content.languages.value}
									</label>
									<div style={{ marginLeft: '8px' }}>
										{languageOptions.map((option) => {
											console.log(
												`🗣️ Rendering language option:`,
												option,
												`checked:`,
												selectedLanguages.includes(option.value),
											);
											return (
												<div className="form-check" key={option.value}>
													<input
														className="form-check-input"
														type="checkbox"
														id={`lang-${option.value}`}
														checked={selectedLanguages.includes(option.value)}
														onChange={(e) => {
															console.log(
																`🗣️ Language checkbox clicked:`,
																option.value,
																e.target.checked,
															);
															handleLanguageChange(
																option.value,
																e.target.checked,
															);
														}}
														style={{
															transform: 'scale(1.2)',
															zIndex: 10,
															position: 'relative',
														}}
													/>
													<label
														className="form-check-label"
														htmlFor={`lang-${option.value}`}
														style={{ fontSize: '14px' }}
													>
														{option.label}
													</label>
												</div>
											);
										})}
									</div>
								</div>

								{/* Demanded Checkbox */}
								{renderCheckbox(
									content.demanded.value,
									isDemanded,
									(e) => {
										console.log('⭐ Demanded changed:', e.target.checked);
										setIsDemanded(e.target.checked);
									},
									'demandedSwitch',
								)}
							</div>
						</div>
					)}
				</div>

				<div
					className="d-flex justify-content-between mt-4"
					style={{
						marginTop: isMobile ? 'auto' : '16px',
						paddingTop: isMobile ? '20px' : '0',
					}}
				>
					<button
						className="btn btn-outline-secondary"
						onClick={handleReset}
						style={{
							fontSize: isMobile ? '16px' : '14px',
							padding: isMobile ? '12px 20px' : '8px 16px',
						}}
					>
						{content.reset.value}
					</button>
					<button
						className="btn btn-primary px-4"
						onClick={handleApply}
						style={{
							fontSize: isMobile ? '16px' : '14px',
							padding: isMobile ? '12px 24px' : '8px 16px',
						}}
					>
						{content.save.value}
					</button>
				</div>
			</div>
		</div>
	);
};

SeekerFilterModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onApply: PropTypes.func.isRequired,
	currentFilters: PropTypes.shape({
		city: PropTypes.string,
		category: PropTypes.string,
		employment: PropTypes.string,
		documentType: PropTypes.string,
		languages: PropTypes.array,
		gender: PropTypes.string,
		isDemanded: PropTypes.bool,
	}),
};

export default SeekerFilterModal;
