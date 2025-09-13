import { useIntlayer, useLocale } from 'react-intlayer';
import { useLanguageManager } from '../../hooks/useLanguageManager';

const LanguageSelector = ({ isMobile = false }) => {
	const content = useIntlayer('navbar');
	const { locale } = useLocale();
	const { changeLanguage, isLoading } = useLanguageManager();

	const getCurrentLanguageName = () => {
		switch (locale) {
			case 'en':
				return content.languageNames.en.value;
			case 'he':
				return content.languageNames.he.value;
			case 'ar':
				return content.languageNames.ar.value;
			case 'uk':
				return content.languageNames.uk.value;
			default:
				return content.languageNames.ru.value;
		}
	};

	const languages = [
		{ code: 'en', name: content.languageNames.en.value },
		{ code: 'ru', name: content.languageNames.ru.value },
		{ code: 'he', name: content.languageNames.he.value },
		{ code: 'ar', name: content.languageNames.ar.value },
		{ code: 'uk', name: content.languageNames.uk.value },
	];

	const dropdownId = isMobile ? 'mobileLanguageDropdown' : 'languageDropdown';
	const buttonClass = isMobile 
		? 'btn btn-secondary dropdown-toggle w-100'
		: 'btn btn-secondary dropdown-toggle';
	const menuClass = isMobile 
		? 'dropdown-menu w-100'
		: 'dropdown-menu';

	return (
		<div className={isMobile ? 'dropdown mb-2' : 'dropdown me-2'}>
			<button
				className={buttonClass}
				type="button"
				id={dropdownId}
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				<i className="bi bi-translate me-2"></i>
				{getCurrentLanguageName()}
			</button>
			<ul className={menuClass} aria-labelledby={dropdownId}>
				{languages.map((language) => (
					<li key={language.code}>
						<button
							onClick={() => changeLanguage(language.code)}
							className="dropdown-item"
							disabled={isLoading}
						>
							{isLoading ? '⏳' : ''} {language.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LanguageSelector;
