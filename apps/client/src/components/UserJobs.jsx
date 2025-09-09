import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Trash, PencilSquare, SortUp } from 'react-bootstrap-icons';
import Skeleton from 'react-loading-skeleton';
import { useIntlayer, useLocale } from 'react-intlayer';
import { format } from 'date-fns';
import { ru, enUS, he, ar } from 'date-fns/locale';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLoadingProgress } from '../hooks/useLoadingProgress';
import { useTranslationHelpers } from '../utils/translationHelpers';
import { ImageModal } from './ui';
import PaginationControl from './PaginationControl';

const API_URL = import.meta.env.VITE_API_URL; // Берем API из .env

const UserJobs = () => {
	const content = useIntlayer('userJobs');
	const { locale } = useLocale();
	const { user } = useUser();
	const { getToken } = useAuth();
	const navigate = useNavigate();
	const { startLoadingWithProgress, completeLoading } = useLoadingProgress();
	const { getCityLabel } = useTranslationHelpers();

	const [jobs, setJobs] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);

	const [showModal, setShowModal] = useState(false);
	const [jobToDelete, setJobToDelete] = useState(null);
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState('');
	const [selectedImageTitle, setSelectedImageTitle] = useState('');
	const [imageLoadingStates, setImageLoadingStates] = useState({});
	const [failedImages, setFailedImages] = useState(new Set());

	// Helper function to get the appropriate date-fns locale
	const getDateLocale = () => {
		switch (locale) {
			case 'en':
				return enUS;
			case 'he':
				return he;
			case 'ar':
				return ar;
			default:
				return ru;
		}
	};

	// Helper function to format date based on language
	const formatDate = (date) => {
		const locale = getDateLocale();
		return format(new Date(date), 'dd MMMM yyyy', { locale });
	};

	// Helper function to check if a job is already boosted
	const isJobBoosted = (job) => {
		if (!job.boostedAt) return false;

		const now = new Date();
		const boostedAt = new Date(job.boostedAt);
		const timeSinceBoost = now - boostedAt;
		const ONE_DAY = 24 * 60 * 60 * 1000;

		return timeSinceBoost < ONE_DAY;
	};

	// Helper function to get remaining time until next boost
	const getTimeUntilNextBoost = (job) => {
		if (!job.boostedAt) return null;

		const now = new Date();
		const boostedAt = new Date(job.boostedAt);
		const timeSinceBoost = now - boostedAt;
		const ONE_DAY = 24 * 60 * 60 * 1000;

		if (timeSinceBoost >= ONE_DAY) return null;

		const timeLeft = ONE_DAY - timeSinceBoost;
		const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
		const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

		return { hours: hoursLeft, minutes: minutesLeft };
	};

	const fetchUserJobs = async () => {
		if (!user) return;

		setLoading(true);
		startLoadingWithProgress(1500); // Start loading progress

		try {
			const response = await axios.get(
				`${API_URL}/api/users/user-jobs/${user.id}?page=${currentPage}&limit=5&lang=${locale}`,
			);

			// Jobs data received from server
			setJobs(response.data.jobs);
			setTotalPages(response.data.totalPages);

			// Initialize loading states for all images
			const initialLoadingStates = {};
			response.data.jobs.forEach((job) => {
				if (job.imageUrl) {
					initialLoadingStates[job.id] = true;
				}
			});
			// Initializing loading states
			setImageLoadingStates(initialLoadingStates);
			setFailedImages(new Set()); // Reset failed images for new jobs
			completeLoading(); // Complete loading when done
		} catch (error) {
			console.error(
				'❌ Ошибка загрузки объявлений пользователя:',
				error.response?.data || error.message,
			);
			toast.error(content.loadJobsError.value);
			completeLoading(); // Complete loading even on error
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserJobs();
	}, [user, currentPage, locale]); // Loading functions are stable now

	const handleDelete = async () => {
		if (!jobToDelete) return;

		startLoadingWithProgress(2000); // Start loading progress for deletion

		try {
			const token = await getToken();
			await axios.delete(`${API_URL}/api/jobs/${jobToDelete}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			completeLoading(); // Complete loading when done
			toast.success(content.jobDeletedSuccess.value);
			setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete));
		} catch (error) {
			console.error('Ошибка удаления объявления:', error);
			completeLoading(); // Complete loading even on error
			toast.error(content.jobDeletedError.value);
		} finally {
			setShowModal(false);
			setJobToDelete(null);
		}
	};

	const openDeleteModal = (jobId) => {
		setJobToDelete(jobId);
		setShowModal(true);
	};

	const handleEdit = (jobId) => {
		navigate(`/edit-job/${jobId}`);
	};

	const handleBoost = async (jobId) => {
		startLoadingWithProgress(1500); // Start loading progress for boost

		try {
			const token = await getToken();
			await axios.post(
				`${API_URL}/api/jobs/${jobId}/boost`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			completeLoading(); // Complete loading when done
			toast.success(content.jobBoostedSuccess.value);
			fetchUserJobs();
		} catch (error) {
			completeLoading(); // Complete loading even on error
			toast.error(error.response?.data?.error || content.jobBoostedError.value);
		}
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleImageClick = (e, imageUrl, title) => {
		e.stopPropagation(); // Prevent card click when clicking image
		setSelectedImageUrl(imageUrl);
		setSelectedImageTitle(title);
		setShowImageModal(true);
	};

	const handleCloseImageModal = () => {
		setShowImageModal(false);
		setSelectedImageUrl('');
		setSelectedImageTitle('');
	};

	const handleImageLoad = (jobId) => {
		// Image load event fired
		setImageLoadingStates((prev) => {
			const newState = {
				...prev,
				[jobId]: false,
			};
			// Loading state updated
			return newState;
		});
	};

	const handleImageError = (jobId, e) => {
		// Image error event fired
		setImageLoadingStates((prev) => {
			const newState = {
				...prev,
				[jobId]: false,
			};
			// Error state updated
			return newState;
		});

		// Mark this image as failed
		setFailedImages((prev) => new Set([...prev, jobId]));

		// Check if it's a CORS error
		if (e.target.src && e.target.src.includes('s3.eu-north-1.amazonaws.com')) {
			console.warn('⚠️ UserJobs - CORS error detected for S3 image:', jobId);
		}

		console.error('❌ UserJobs - Mini image failed to load for job:', jobId, e);
	};

	// Add timeout to prevent infinite loading
	useEffect(() => {
		const timeouts = {};

		// Set up timeouts for all images that are loading
		Object.keys(imageLoadingStates).forEach((jobId) => {
			if (imageLoadingStates[jobId] === true) {
				timeouts[jobId] = setTimeout(() => {
					setImageLoadingStates((prev) => {
						if (prev[jobId] === true) {
							console.warn(
								'⚠️ UserJobs - Image loading timeout for job:',
								jobId,
							);
							return {
								...prev,
								[jobId]: false,
							};
						}
						return prev;
					});
				}, 3000); // 3 second timeout for CORS issues
			}
		});

		// Cleanup timeouts
		return () => {
			Object.values(timeouts).forEach((timeout) => clearTimeout(timeout));
		};
	}, [imageLoadingStates]);

	if (!user) {
		return <p className="text-center">{content.signInToView.value}</p>;
	}

	return (
		<>
			<div className="mt-4">
				<h2
					className={`text-lg font-bold mb-3 text-center text-primary ${locale === 'he' || locale === 'ar' ? 'text-end' : 'text-start'}`}
				>
					{loading ? (
						<Skeleton width={200} height={24} />
					) : (
						content.myAdsTitle.value
					)}
				</h2>

				{loading ? (
					<div className="d-flex flex-column align-items-center">
						{Array.from({ length: 5 }).map((_, index) => (
							<div
								key={index}
								className="card mb-3 shadow-sm"
								style={{ width: '90%', maxWidth: '700px', minHeight: '220px' }}
							>
								<div className="card-body">
									<Skeleton height={30} width="70%" />
									<Skeleton height={20} width="90%" className="mt-2" />
									<Skeleton height={20} width="60%" className="mt-2" />
								</div>
							</div>
						))}
					</div>
				) : jobs.length === 0 ? (
					<div
						className={`text-center ${locale === 'he' || locale === 'ar' ? 'text-end' : 'text-start'}`}
					>
						<p className="fs-4 mb-4">{content.youDontHaveAds.value}</p>
						<div className="mt-4">
							<img
								src="/images/item-not-found.webp"
								alt="No ads illustration"
								className="img-fluid mobile-optimized-image"
								style={{
									width: '90vw',
									maxWidth: '400px',
									height: 'auto',
									borderRadius: '12px',
									margin: '0 auto',
									display: 'block',
									objectFit: 'contain',
									opacity: '0.7',
								}}
							/>
						</div>
					</div>
				) : (
					<div className="d-flex flex-column" style={{ minHeight: '700px' }}>
						{jobs.map((job) => {
							const isBoosted = isJobBoosted(job);
							const timeUntilNextBoost = getTimeUntilNextBoost(job);

							return (
								<div
									key={job.id}
									className={`card mb-3 position-relative shadow-sm ${
										job.user?.isPremium ? 'premium-job' : ''
									}`}
									style={{
										width: '90%',
										maxWidth: '700px',
										margin: '0 auto',
										background: job.user?.isPremium ? '#D4E6F9' : 'white',
										borderRadius: '6px',
									}}
								>
									{/* Плашка Премиум */}
									{job.user?.isPremium && (
										<div className="premium-badge">
											<i className="bi bi-star-fill"></i>{' '}
											{content.premiumBadge.value}
										</div>
									)}
									<div
										className="card-body"
										style={{
											textAlign:
												locale === 'he' || locale === 'ar' ? 'right' : 'left',
										}}
									>
										<h5 className="card-title text-primary">{job.title}</h5>
										{job.category?.label && (
											<div className="mb-2">
												<span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">
													{job.category.label}
												</span>
											</div>
										)}
										{!job.category?.label && (
											<div className="mb-2">
												<span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">
													{content.notSpecified.value}
												</span>
											</div>
										)}
										<p className="card-text">
											<strong>{content.salaryPerHourCard.value}</strong>{' '}
											{job.salary}
											<br />
											<strong>{content.locationCard.value}</strong>{' '}
											{job.city?.name
												? getCityLabel(job.city.name)
												: content.notSpecified.value}
										</p>
										<p className="card-text">{job.description}</p>
										<div className="card-text">
											{typeof job.shuttle === 'boolean' && (
												<p className="card-text mb-1">
													<strong>{content.shuttle.value}:</strong>{' '}
													{job.shuttle ? content.yes.value : content.no.value}
												</p>
											)}
											{typeof job.meals === 'boolean' && (
												<p className="card-text mb-1">
													<strong>{content.meals.value}:</strong>{' '}
													{job.meals ? content.yes.value : content.no.value}
												</p>
											)}
											<p className="card-text mb-0">
												<strong>{content.phoneNumberCard.value}</strong>{' '}
												{job.phone}
											</p>
										</div>

										{/* Image displayed under phone number in mini size */}
										{job.imageUrl && (
											<div
												className={`mt-3 ${locale === 'he' || locale === 'ar' ? 'text-end' : 'text-start'}`}
											>
												{/* Image rendering for job */}
												{imageLoadingStates[job.id] && (
													<Skeleton
														width={120}
														height={80}
														style={{
															borderRadius: '6px',
															border: '1px solid #e0e0e0',
															marginLeft:
																locale === 'he' || locale === 'ar'
																	? 'auto'
																	: '0',
															marginRight:
																locale === 'he' || locale === 'ar'
																	? '0'
																	: 'auto',
														}}
													/>
												)}

												{failedImages.has(job.id) ? (
													<div
														style={{
															width: '120px',
															height: '80px',
															background: '#f8f9fa',
															border: '1px solid #e0e0e0',
															borderRadius: '6px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															color: '#6c757d',
															fontSize: '12px',
															textAlign: 'center',
															whiteSpace: 'pre-line',
															marginLeft:
																locale === 'he' || locale === 'ar'
																	? 'auto'
																	: '0',
															marginRight:
																locale === 'he' || locale === 'ar'
																	? '0'
																	: 'auto',
														}}
													>
														{content.imageUnavailable.value}
													</div>
												) : (
													<img
														src={job.imageUrl}
														alt={job.title}
														className="img-fluid rounded"
														style={{
															width: '120px',
															height: '80px',
															objectFit: 'cover',
															borderRadius: '6px',
															border: '1px solid #e0e0e0',
															cursor: 'pointer',
															display: imageLoadingStates[job.id]
																? 'none'
																: 'block',
															marginLeft:
																locale === 'he' || locale === 'ar'
																	? 'auto'
																	: '0',
															marginRight:
																locale === 'he' || locale === 'ar'
																	? '0'
																	: 'auto',
														}}
														onClick={(e) =>
															handleImageClick(e, job.imageUrl, job.title)
														}
														onLoad={() => handleImageLoad(job.id)}
														onError={(e) => {
															handleImageError(job.id, e);
															// Hide the broken image
															e.target.style.display = 'none';
														}}
													/>
												)}
											</div>
										)}

										<div className="text-muted">
											<small>
												<span className="d-none d-sm-inline">
													{content.createdAt.value + ': '}
												</span>
												{formatDate(job.createdAt)}
											</small>
										</div>
									</div>
									<div
										className={`position-absolute bottom-0 mb-3 d-flex gap-3 ${locale === 'he' || locale === 'ar' ? 'start-0 ms-3 flex-row-reverse' : 'end-0 me-3'}`}
									>
										<div className="position-relative">
											{isBoosted ? (
												<div
													className={`d-flex align-items-center gap-2 ${locale === 'he' || locale === 'ar' ? 'flex-row-reverse' : ''}`}
												>
													<small
														className="text-muted d-none d-sm-inline"
														style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
													>
														{content.nextBoostAfter.value}
													</small>
													<div
														className="px-2 py-1 rounded"
														style={{
															fontSize: '11px',
															background: 'rgba(0,0,0,0.1)',
															color: '#000000',
															border: '1px solid rgba(0,0,0,0.2)',
															whiteSpace: 'nowrap',
														}}
													>
														{timeUntilNextBoost
															? `${timeUntilNextBoost.hours}${content.hoursShort.value} ${timeUntilNextBoost.minutes}${content.minutesShort.value}`
															: content.boostReady.value}
													</div>
												</div>
											) : (
												<SortUp
													role="button"
													size={24}
													className="text-success"
													onClick={() => handleBoost(job.id)}
													title={content.boostTitle.value}
													style={{ cursor: 'pointer' }}
												/>
											)}
										</div>
										<PencilSquare
											role="button"
											size={24}
											className="text-primary"
											onClick={() => handleEdit(job.id)}
										/>
										<Trash
											role="button"
											size={24}
											className="text-danger"
											onClick={() => openDeleteModal(job.id)}
										/>
									</div>
								</div>
							);
						})}
						{totalPages > 1 && (
							<PaginationControl
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</div>
				)}

				{/* Delete Confirmation Modal */}
				<Modal show={showModal} onHide={() => setShowModal(false)} centered>
					<Modal.Header closeButton>
						<Modal.Title>{content.confirmDelete.value}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{content.confirmDeleteText.value}</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => setShowModal(false)}>
							{content.cancel.value}
						</Button>
						<Button variant="danger" onClick={handleDelete}>
							{content.delete.value}
						</Button>
					</Modal.Footer>
				</Modal>

				{/* Image Modal - Only render if there's an image URL */}
				{selectedImageUrl && (
					<ImageModal
						show={showImageModal}
						onHide={handleCloseImageModal}
						imageUrl={selectedImageUrl}
						imageAlt={selectedImageTitle}
						onImageError={(e) =>
							console.error(
								'❌ UserJobs - Modal image failed to load:',
								selectedImageUrl,
								e,
							)
						}
					/>
				)}
			</div>
		</>
	);
};

export default UserJobs;
