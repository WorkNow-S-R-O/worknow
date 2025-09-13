import PropTypes from 'prop-types';
import { useIntlayer } from 'react-intlayer';

const NewsletterHeader = ({ onClose, isMobile }) => {
	const content = useIntlayer('newsletterModal');

	if (isMobile) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '24px',
				}}
			>
				<h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
					{content.newsletterTitle.value}
				</h5>
				<button
					type="button"
					className="btn-close"
					aria-label="Close"
					onClick={onClose}
					style={{ fontSize: '15px' }}
				></button>
			</div>
		);
	}

	return (
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
					fontSize: '16px',
				}}
			></button>
			<h5 className="mb-4 font-size-10">
				{content.newsletterTitle.value}
			</h5>
		</>
	);
};

NewsletterHeader.propTypes = {
	onClose: PropTypes.func.isRequired,
	isMobile: PropTypes.bool.isRequired,
};

export default NewsletterHeader;
