import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useIntlayer } from 'react-intlayer';
import { useState } from 'react';
import useFetchCities from '../hooks/useFetchCities';
import useFetchCategories from '../hooks/useFetchCategories';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ImageModal } from './ui';

const JobCard = ({ job }) => {
	const content = useIntlayer('jobCard');
	const navigate = useNavigate();
	const { cities, loading: citiesLoading } = useFetchCities();
	const { categories, loading: categoriesLoading } = useFetchCategories();
	const [showImageModal, setShowImageModal] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	// Получаем название города на нужном языке
	let cityLabel = null;
	if (job.cityId && Array.isArray(cities)) {
		const city = cities.find(
			(c) => c.value === job.cityId || c.id === job.cityId,
		);
		cityLabel = city?.label || city?.name || null;
	}

	// Получаем название категории на нужном языке
	let categoryLabel = null;
	if (job.categoryId && Array.isArray(categories)) {
		const category = categories.find(
			(c) => c.value === job.categoryId || c.id === job.categoryId,
		);
		categoryLabel = category?.label || category?.name || null;
	}

	const handleImageClick = (e) => {
		e.stopPropagation(); // Prevent card click when clicking image
		setShowImageModal(true);
	};

	const handleCloseModal = () => {
		setShowImageModal(false);
	};

	const handleImageLoad = () => {
		setImageLoading(false);
	};

	const handleImageError = () => {
		setImageLoading(false);
	};

	return (
		<>
			<div
				className={`card shadow-sm mb-4 position-relative text-start ${
					job.user?.isPremium ? 'premium-job' : ''
				}`}
				style={{
					backgroundColor: job.user?.isPremium ? '#D4E6F9' : 'white',
					width: '90%',
					maxWidth: '700px',
					borderRadius: '6px',
					minHeight: '220px',
					cursor: job.user?.clerkUserId ? 'pointer' : 'default',
				}}
				onClick={() => {
					if (job.user?.clerkUserId) {
						navigate(`/profile/${job.user.clerkUserId}`);
					}
				}}
			>
				{/* Плашка Премиум */}
				{job.user?.isPremium && (
					<div className="premium-badge">
						<i className="bi bi-star-fill"></i> {content.premiumBadge.value}
					</div>
				)}
				<div className="card-body">
					<h5 className="card-title text-primary">{job.title}</h5>
					{(job.categoryId || job.category?.label) && (
						<div className="mb-2">
							{categoriesLoading ? (
								<Skeleton
									width={80}
									height={24}
									style={{ display: 'inline-block', borderRadius: '4px' }}
								/>
							) : (
								<span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">
									{categoryLabel ||
										job.category?.label ||
										content.notSpecified.value}
								</span>
							)}
						</div>
					)}
					<p className="card-text">
						<strong>{content.salaryPerHourCard.value}</strong>{' '}
						{job.salary || content.notSpecified.value}
						<br />
						<strong>{content.locationCard.value}</strong>{' '}
						{citiesLoading ? (
							<Skeleton
								width={80}
								height={18}
								style={{ display: 'inline-block', verticalAlign: 'middle' }}
							/>
						) : (
							cityLabel || content.notSpecified.value
						)}
					</p>
					<p className="card-text">
						{job.description || content.descriptionMissing.value}
					</p>
					<div className="card-text">
						{typeof job.shuttle === 'boolean' && (
							<div className="card-text">
								<strong>{content.shuttle.value}:</strong>{' '}
								{job.shuttle ? content.yes.value : content.no.value}
							</div>
						)}
						{typeof job.meals === 'boolean' && (
							<div className="card-text">
								<strong>{content.meals.value}:</strong>{' '}
								{job.meals ? content.yes.value : content.no.value}
							</div>
						)}
						<strong>{content.phoneNumberCard.value}</strong>{' '}
						{job.phone || content.phoneNotSpecified.value}
					</div>

					{/* Image displayed under phone number in mini size */}
					{job.imageUrl && (
						<div className="mt-3">
							{imageLoading && (
								<Skeleton
									width={120}
									height={80}
									style={{
										borderRadius: '3px',
										border: '1px solid #e0e0e0',
									}}
								/>
							)}
							<img
								src={job.imageUrl}
								alt={job.title}
								className="img-fluid rounded"
								style={{
									width: '120px',
									height: '80px',
									objectFit: 'cover',
									borderRadius: '3px',
									border: '1px solid #e0e0e0',
									cursor: 'pointer',
									display: imageLoading ? 'none' : 'block',
								}}
								onClick={handleImageClick}
								onLoad={handleImageLoad}
								onError={handleImageError}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Image Modal - Only render if there's an image URL */}
			{job.imageUrl && (
				<ImageModal
					show={showImageModal}
					onHide={handleCloseModal}
					imageUrl={job.imageUrl}
					imageAlt={job.title}
					onImageError={() => {}}
				/>
			)}
		</>
	);
};

// **Валидация пропсов**
JobCard.propTypes = {
	job: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		cityId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		city: PropTypes.object,
		title: PropTypes.string,
		salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		description: PropTypes.string,
		phone: PropTypes.string,
		category: PropTypes.object,
		user: PropTypes.object,
		shuttle: PropTypes.bool,
		meals: PropTypes.bool,
		imageUrl: PropTypes.string,
	}).isRequired,
};

export default JobCard;
