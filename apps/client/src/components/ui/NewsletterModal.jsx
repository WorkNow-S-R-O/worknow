import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntlayer } from 'react-intlayer';
import VerificationModal from './VerificationModal.jsx';
import NewsletterHeader from './NewsletterHeader.jsx';
import NewsletterStatus from './NewsletterStatus.jsx';
import NewsletterForm from './NewsletterForm.jsx';
import NewsletterFilters from './NewsletterFilters.jsx';
import NewsletterActions from './NewsletterActions.jsx';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';
import { getModalOverlayStyle, getModalContentStyle } from './modalStyles';
import useNewsletterForm from '@/hooks/useNewsletterForm';


const NewsletterModal = ({ open, onClose }) => {
	const modalRef = useRef();
	const content = useIntlayer('newsletterModal');

	const isMobile = useIsMobile();
	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeToClose({ onClose });

	const form = useNewsletterForm({ content, onSuccess: onClose });

	useEffect(() => {
		if (open) {
			form.initForm();
		}
	}, [open]);

	const handleOutsideClick = (event) => {
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			onClose();
		}
	};

	const handleCityChange = (city, checked) => {
		if (checked) {
			form.setSelectedCities((prev) => [...prev, city.name]);
		} else {
			form.setSelectedCities((prev) => prev.filter((c) => c !== city.name));
		}
	};

	const handleCategoryChange = (category, checked) => {
		const value = category.label || category.name;
		if (checked) {
			form.setSelectedCategories((prev) => [...prev, value]);
		} else {
			form.setSelectedCategories((prev) => prev.filter((c) => c !== value));
		}
	};

	const handleEmploymentChange = (option, checked) => {
		if (checked) {
			form.setSelectedEmployment((prev) => [...prev, option.value]);
		} else {
			form.setSelectedEmployment((prev) =>
				prev.filter((emp) => emp !== option.value),
			);
		}
	};

	const handleDocumentTypeChange = (option, checked) => {
		if (checked) {
			form.setSelectedDocumentTypes((prev) => [...prev, option.value]);
		} else {
			form.setSelectedDocumentTypes((prev) =>
				prev.filter((doc) => doc !== option.value),
			);
		}
	};

	const handleLanguageChange = (languageValue, checked) => {
		if (checked) {
			form.setSelectedLanguages((prev) => [...prev, languageValue]);
		} else {
			form.setSelectedLanguages((prev) =>
				prev.filter((lang) => lang !== languageValue),
			);
		}
	};

	const handleGenderChange = (genderValue, checked) => {
		if (checked) {
			form.setSelectedGender((prev) => [...prev, genderValue]);
		} else {
			form.setSelectedGender((prev) => prev.filter((g) => g !== genderValue));
		}
	};

	const modalStyle = getModalOverlayStyle(isMobile);
	const contentStyle = getModalContentStyle(isMobile, {
		desktopWidth: 900,
		desktopHeight: 900,
		desktopBorderRadius: 18,
		desktopPadding: 40,
		desktopMaxWidth: '95vw',
		desktopMaxHeight: '95vh',
	});

	if (!open) return null;

	return (
		<>
			<div
				style={modalStyle}
				onTouchStart={isMobile ? onTouchStart : undefined}
				onTouchMove={isMobile ? onTouchMove : undefined}
				onTouchEnd={isMobile ? onTouchEnd : undefined}
				onMouseDown={!isMobile ? handleOutsideClick : undefined}
			>
				<div ref={modalRef} style={contentStyle}>
					<NewsletterHeader onClose={onClose} isMobile={isMobile} />

					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<div style={{ marginBottom: '24px' }}>
							<NewsletterStatus
								isAlreadySubscribed={form.isAlreadySubscribed}
								subscriberData={form.subscriberData}
								email={form.email}
								isMobile={isMobile}
							/>

							<NewsletterForm
								email={form.email}
								firstName={form.firstName}
								lastName={form.lastName}
								onEmailChange={form.handleEmailChange}
								onFirstNameChange={(e) => form.setFirstName(e.target.value)}
								onLastNameChange={(e) => form.setLastName(e.target.value)}
								isSubscribing={form.isSubscribing}
								isUnsubscribing={form.isUnsubscribing}
								isAlreadySubscribed={form.isAlreadySubscribed}
								isMobile={isMobile}
							/>

							{!form.isAlreadySubscribed && (
								<div style={{ marginBottom: '20px' }}>
									<h6
										style={{
											marginBottom: '16px',
											fontSize: isMobile ? '16px' : '14px',
											fontWeight: '600',
											color: '#333',
										}}
									>
										Получать уведомления о кандидатах:
									</h6>

									<NewsletterFilters
										cities={form.cities}
										categories={form.categories}
										selectedCities={form.selectedCities}
										selectedCategories={form.selectedCategories}
										selectedEmployment={form.selectedEmployment}
										selectedDocumentTypes={form.selectedDocumentTypes}
										selectedLanguages={form.selectedLanguages}
										selectedGender={form.selectedGender}
										onlyDemanded={form.onlyDemanded}
										onCityChange={handleCityChange}
										onCategoryChange={handleCategoryChange}
										onEmploymentChange={handleEmploymentChange}
										onDocumentTypeChange={handleDocumentTypeChange}
										onLanguageChange={handleLanguageChange}
										onGenderChange={handleGenderChange}
										onOnlyDemandedChange={form.setOnlyDemanded}
										isSubscribing={form.isSubscribing}
										isUnsubscribing={form.isUnsubscribing}
										isMobile={isMobile}
									/>
								</div>
							)}
						</div>
					</div>

					<div
						className="d-flex justify-content-between mt-4"
						style={{
							marginTop: '20px',
							paddingTop: '20px',
							borderTop: '1px solid #e0e0e0',
						}}
					>
						<NewsletterActions
							isAlreadySubscribed={form.isAlreadySubscribed}
							isSubscribing={form.isSubscribing}
							isUnsubscribing={form.isUnsubscribing}
							onSubscribe={form.handleSubscribe}
							onUnsubscribe={form.handleUnsubscribe}
							isMobile={isMobile}
						/>
					</div>
				</div>
			</div>

			<VerificationModal
				open={form.showVerification}
				onClose={form.handleVerificationClose}
				email={form.email}
				subscriptionData={form.subscriptionData}
				onVerificationSuccess={form.handleVerificationSuccess}
			/>
		</>
	);
};

NewsletterModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default NewsletterModal;
