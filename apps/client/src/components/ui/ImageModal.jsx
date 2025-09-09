import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

const ImageModal = ({
	show,
	onHide,
	imageUrl,
	imageAlt,
	onImageError = (e) =>
		console.error('❌ ImageModal - Image failed to load:', e),
}) => {
	// Don't render the modal if there's no image URL
	if (!imageUrl) {
		return null;
	}

	return (
		<Modal
			show={show}
			onHide={onHide}
			centered
			className="image-modal"
			dialogClassName="modal-dialog-centered modal-dialog-scrollable"
			style={{
				maxWidth: '95vw',
				margin: 'auto',
			}}
		>
			<Modal.Body className="text-center p-0 position-relative">
				<Button
					variant="link"
					onClick={onHide}
					className="position-absolute top-0 end-0 p-2"
					style={{
						zIndex: 1050,
						color: '#6c757d',
						textDecoration: 'none',
					}}
				>
					<X size={32} />
				</Button>
				<img
					src={imageUrl}
					alt={imageAlt}
					className="img-fluid"
					style={{
						maxHeight: '90vh',
						maxWidth: '100%',
						width: 'auto',
						height: 'auto',
						objectFit: 'contain',
						display: 'block',
						margin: '0 auto',
					}}
					onError={onImageError}
				/>
			</Modal.Body>
		</Modal>
	);
};

ImageModal.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	imageUrl: PropTypes.string, // Changed from isRequired to optional
	imageAlt: PropTypes.string.isRequired,
	onImageError: PropTypes.func,
};

export default ImageModal;
