import PropTypes from 'prop-types';
import { useIntlayer } from 'react-intlayer';

const NewsletterActions = ({
	isAlreadySubscribed,
	isSubscribing,
	isUnsubscribing,
	onSubscribe,
	onUnsubscribe,
	isMobile,
}) => {
	const content = useIntlayer('newsletterModal');

	if (isAlreadySubscribed) {
		// Show unsubscribe button and "Вы уже подписаны" text
		return (
			<>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						color: '#666',
						fontSize: isMobile ? '16px' : '14px',
					}}
				>
					<i
						className="bi bi-info-circle me-2"
						style={{ color: '#17a2b8' }}
					></i>
					{content.newsletterAlreadySubscribed.value}
				</div>
				<button
					className="btn btn-danger"
					onClick={onUnsubscribe}
					disabled={isUnsubscribing}
					style={{
						fontSize: isMobile ? '16px' : '14px',
						padding: isMobile ? '12px 20px' : '8px 16px',
					}}
				>
					{isUnsubscribing ? (
						<>
							<span
								className="spinner-border spinner-border-sm me-2"
								role="status"
								aria-hidden="true"
							></span>
							{content.newsletterUnsubscribing.value}
						</>
					) : (
						<>
							<i className="bi bi-envelope-x me-2"></i>
							{content.unsubscribe.value}
						</>
					)}
				</button>
			</>
		);
	}

	// Show only subscribe button (no reset button for new subscriptions)
	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<button
				className="btn btn-primary px-4"
				onClick={onSubscribe}
				disabled={isSubscribing}
				style={{
					fontSize: isMobile ? '16px' : '14px',
					padding: isMobile ? '12px 24px' : '8px 16px',
					minWidth: '200px',
				}}
			>
				{isSubscribing ? (
					<>
						<span
							className="spinner-border spinner-border-sm me-2"
							role="status"
							aria-hidden="true"
						></span>
						{content.newsletterSubscribing.value}
					</>
				) : (
					<>
						<i className="bi bi-envelope-plus me-2"></i>
						{content.newsletterSubscribe.value}
					</>
				)}
			</button>
		</div>
	);
};

NewsletterActions.propTypes = {
	isAlreadySubscribed: PropTypes.bool.isRequired,
	isSubscribing: PropTypes.bool.isRequired,
	isUnsubscribing: PropTypes.bool.isRequired,
	onSubscribe: PropTypes.func.isRequired,
	onUnsubscribe: PropTypes.func.isRequired,
	isMobile: PropTypes.bool.isRequired,
};

export default NewsletterActions;
