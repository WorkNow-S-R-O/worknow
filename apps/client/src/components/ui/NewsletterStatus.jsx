import PropTypes from 'prop-types';
import { useIntlayer } from 'react-intlayer';

const NewsletterStatus = ({
	isAlreadySubscribed,
	subscriberData,
	email,
	isMobile,
}) => {
	const content = useIntlayer('newsletterModal');

	if (isAlreadySubscribed) {
		// Already subscribed view
		return (
			<div
				style={{
					backgroundColor: '#e8f5e8',
					padding: '20px',
					borderRadius: '8px',
					marginBottom: '20px',
					border: '1px solid #d4edda',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: '15px',
					}}
				>
					<i
						className="bi bi-check-circle-fill"
						style={{
							color: '#28a745',
							fontSize: '24px',
							marginRight: '10px',
						}}
					></i>
					<h6 style={{ margin: 0, color: '#155724' }}>
						{content.newsletterAlreadySubscribed.value}
					</h6>
				</div>
				<p style={{ margin: 0, color: '#155724', fontSize: '14px' }}>
					{subscriberData?.firstName && subscriberData?.lastName
						? `${subscriberData.firstName} ${subscriberData.lastName} (${email})`
						: email}
				</p>
			</div>
		);
	}

	// Subscribe view
	return (
		<p
			style={{
				fontSize: isMobile ? '16px' : '14px',
				color: '#666',
				marginBottom: '20px',
				lineHeight: '1.5',
			}}
		>
			{content.newsletterDescription.value}
		</p>
	);
};

NewsletterStatus.propTypes = {
	isAlreadySubscribed: PropTypes.bool.isRequired,
	subscriberData: PropTypes.object,
	email: PropTypes.string.isRequired,
	isMobile: PropTypes.bool.isRequired,
};

export default NewsletterStatus;
