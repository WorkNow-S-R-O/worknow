import PropTypes from 'prop-types';
import { useIntlayer } from 'react-intlayer';

const NewsletterForm = ({
	email,
	firstName,
	lastName,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
	isSubscribing,
	isUnsubscribing,
	isAlreadySubscribed,
	isMobile,
}) => {
	const content = useIntlayer('newsletterModal');

	return (
		<>
			<div style={{ marginBottom: '16px' }}>
				<label
					style={{
						fontSize: isMobile ? '16px' : '14px',
						fontWeight: '500',
						marginBottom: '8px',
						display: 'block',
					}}
				>
					{content.newsletterFirstName.value}
				</label>
				<input
					type="text"
					className="form-control"
					value={firstName}
					onChange={onFirstNameChange}
					placeholder={content.newsletterFirstNamePlaceholder.value}
					style={{
						fontSize: isMobile ? '16px' : '14px',
						padding: isMobile ? '12px' : '8px',
						width: '100%',
					}}
					disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
				/>
			</div>

			<div style={{ marginBottom: '16px' }}>
				<label
					style={{
						fontSize: isMobile ? '16px' : '14px',
						fontWeight: '500',
						marginBottom: '8px',
						display: 'block',
					}}
				>
					{content.newsletterLastName.value}
				</label>
				<input
					type="text"
					className="form-control"
					value={lastName}
					onChange={onLastNameChange}
					placeholder={content.newsletterLastNamePlaceholder.value}
					style={{
						fontSize: isMobile ? '16px' : '14px',
						padding: isMobile ? '12px' : '8px',
						width: '100%',
					}}
					disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
				/>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<label
					style={{
						fontSize: isMobile ? '16px' : '14px',
						fontWeight: '500',
						marginBottom: '8px',
						display: 'block',
					}}
				>
					{content.newsletterEmailLabel.value}
				</label>
				<input
					type="email"
					className="form-control"
					value={email}
					onChange={onEmailChange}
					placeholder={content.newsletterEmailPlaceholder.value}
					style={{
						fontSize: isMobile ? '16px' : '14px',
						padding: isMobile ? '12px' : '8px',
						width: '100%',
					}}
					disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
					required
				/>
			</div>
		</>
	);
};

NewsletterForm.propTypes = {
	email: PropTypes.string.isRequired,
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	onEmailChange: PropTypes.func.isRequired,
	onFirstNameChange: PropTypes.func.isRequired,
	onLastNameChange: PropTypes.func.isRequired,
	isSubscribing: PropTypes.bool.isRequired,
	isUnsubscribing: PropTypes.bool.isRequired,
	isAlreadySubscribed: PropTypes.bool.isRequired,
	isMobile: PropTypes.bool.isRequired,
};

export default NewsletterForm;
