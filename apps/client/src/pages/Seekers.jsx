import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useIntlayer } from 'react-intlayer';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Facebook } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import PaginationControl from '../components/PaginationControl';
import AddSeekerModal from '../components/form/AddSeekerModal';
import SeekerFilterModal from '../components/ui/SeekerFilterModal';
import useSeekerFilterStore from '../store/seekerFilterStore';
import useSeekers from '../hooks/useSeekers';
import '../css/seekers-table-mobile.css';
import '../css/seekers-mobile.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLoadingProgress } from '../hooks/useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to parse contact field and extract Facebook link
const parseContactField = (contact) => {
	if (!contact) return { phone: '', facebook: null };

	// Split by comma to separate phone and Facebook
	const parts = contact.split(',').map((part) => part.trim());

	let phone = '';
	let facebook = null;

	parts.forEach((part) => {
		if (part.includes('facebook.com') || part.includes('fb.com')) {
			// Extract Facebook URL
			let fbUrl = part;
			if (!fbUrl.startsWith('http')) {
				fbUrl = 'https://' + fbUrl;
			}
			facebook = fbUrl;
		} else {
			// This is likely a phone number
			phone = part;
		}
	});

	return { phone, facebook };
};

// Helper function to render contact cell
const renderContactCell = (
	contact,
	isPremium,
	seekerId,
	seekerIds,
	currentIndex,
	facebook,
	returnToPage,
) => {
	const linkProps = {
		to: `/seekers/${seekerId}`,
		state: { seekerIds, currentIndex, returnToPage },
		style: { color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' },
	};

	if (!isPremium) {
		return <Link {...linkProps}>****</Link>;
	}

	// Parse contact field to extract Facebook if it's embedded there
	const { phone: parsedPhone, facebook: parsedFacebook } =
		parseContactField(contact);

	// Use dedicated facebook field if available, otherwise use parsed facebook
	const facebookUrl = facebook || parsedFacebook;
	const displayContact = parsedPhone || contact;

	return (
		<div className="d-flex align-items-center gap-2">
			{displayContact && <Link {...linkProps}>{displayContact}</Link>}
			{facebookUrl && (
				<a
					href={
						facebookUrl.startsWith('http')
							? facebookUrl
							: `https://${facebookUrl}`
					}
					target="_blank"
					rel="noopener noreferrer"
					className="text-decoration-none"
					title={content.facebookProfile.value}
				>
					<Facebook className="text-primary fs-5" />
				</a>
			)}
		</div>
	);
};

export default function Seekers() {
	const content = useIntlayer('seekers');
	const { user } = useUser();
	const { startLoadingWithProgress, completeLoading } = useLoadingProgress();
	const { filters, setFilters } = useSeekerFilterStore();
	const location = useLocation();
	// Initialize currentPage from localStorage or default to 1
	const [currentPage, setCurrentPage] = useState(() => {
		const savedPage = localStorage.getItem('seekersCurrentPage');
		return savedPage ? parseInt(savedPage) : 1;
	});

	// Force re-render when currentPage changes to ensure useSeekers hook re-runs
	const [forceRefresh, setForceRefresh] = useState(0);

	const { seekers, loading, error, pagination } = useSeekers(
		currentPage,
		filters,
		forceRefresh,
	);

	// Debug logging for page state
	// Seekers component state updated

	// Handle return navigation from seeker details
	useEffect(() => {
		// Location state checked

		if (location.state?.returnToPage) {
			const returnPage = location.state.returnPage;
			// Returning to previous page

			// Set the page immediately when returning
			if (returnPage && typeof returnPage === 'number' && returnPage > 0) {
				setCurrentPage(returnPage);
				// Save current page to localStorage
				localStorage.setItem('seekersCurrentPage', returnPage.toString());

				// Force a refresh to ensure useSeekers hook re-runs
				setForceRefresh((prev) => prev + 1);
			} else {
				console.warn(
					'⚠️ Invalid returnPage value:',
					returnPage,
					'using current page:',
					currentPage,
				);
				// Use current page as fallback
				localStorage.setItem('seekersCurrentPage', currentPage.toString());
			}

			// Clear the state to prevent re-applying on subsequent renders
			window.history.replaceState({}, document.title);
		} else {
			// If no returnToPage in state, try to restore from localStorage
			const savedPage = localStorage.getItem('seekersCurrentPage');
			if (savedPage && parseInt(savedPage) !== currentPage) {
				const pageToRestore = parseInt(savedPage);
				// Restoring page from localStorage
				setCurrentPage(pageToRestore);
				setForceRefresh((prev) => prev + 1);
			}
		}
	}, [location.state, currentPage]);

	// Force refresh when currentPage changes
	useEffect(() => {
		// Current page updated

		// Force a re-render of the useSeekers hook when page changes
		if (currentPage > 1) {
			setForceRefresh((prev) => prev + 1);
		}
	}, [currentPage]);

	// Save page to localStorage whenever currentPage changes
	useEffect(() => {
		localStorage.setItem('seekersCurrentPage', currentPage.toString());
		// Page saved to localStorage
	}, [currentPage]);

	// Clean up localStorage when component unmounts
	useEffect(() => {
		return () => {
			// Don't clear localStorage on unmount - keep the page state for next visit
		};
	}, []);

	const [isPremium, setIsPremium] = useState(false);
	const isAdmin =
		user?.emailAddresses?.[0]?.emailAddress ===
		'worknow.notifications@gmail.com';

	const [showAddModal, setShowAddModal] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [deleteMode, setDeleteMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);
	const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
	const navigate = useNavigate();

	// Use server-side pagination if available, otherwise fall back to client-side
	const totalPages = pagination
		? pagination.totalPages
		: Math.ceil(seekers.length / 10);

	const handleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const handleSelectAll = () => {
		if (selectedIds.length === seekers.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(seekers.map((s) => s.id));
		}
	};

	const handleStartDeleteMode = () => {
		setDeleteMode(true);
		setSelectedIds([]);
	};

	const handleCancelDeleteMode = () => {
		setDeleteMode(false);
		setSelectedIds([]);
	};

	const handleConfirmDelete = async () => {
		if (!window.confirm(content.deleteConfirmation.value)) return;

		startLoadingWithProgress(2500); // Start loading progress for deletion

		try {
			await Promise.all(
				selectedIds.map((id) => axios.delete(`${API_URL}/api/seekers/${id}`)),
			);
			completeLoading(); // Complete loading when done
			toast.success(content.successfullyDeleted.value);
			setSelectedIds([]);
			setDeleteMode(false);
			// Reset to first page and refresh data instead of reloading the page
			setCurrentPage(1);
			// Save current page to localStorage
			localStorage.setItem('seekersCurrentPage', '1');
			// The useSeekers hook will automatically refresh when currentPage changes
		} catch (error) {
			completeLoading(); // Complete loading even on error
			console.error('Error deleting seekers:', error);
			toast.error(content.errorDeleting.value);
		}
	};

	// Use server-side pagination data if available, otherwise fall back to client-side
	const currentSeekers = seekers;

	const handlePageChange = (page) => {
		// Manually changing page
		setCurrentPage(page);
		// Save current page to localStorage
		localStorage.setItem('seekersCurrentPage', page.toString());
		window.scrollTo({ top: 0, behavior: 'smooth' });
		// The useSeekers hook will automatically show loading state when page changes
	};

	const handleFilterApply = (newFilters) => {
		// Applying filters
		setFilters(newFilters);
		setCurrentPage(1); // Reset to first page when filters change
		// Save current page to localStorage
		localStorage.setItem('seekersCurrentPage', '1');
		// Show a toast notification about filter application
		toast.success(content.filtersApplied.value);
		// The useSeekers hook will automatically refresh when filters change
	};

	useEffect(() => {
		if (!user) return;
		axios
			.get(`${API_URL}/api/users/${user.id}`)
			.then((res) => setIsPremium(!!res.data.isPremium))
			.catch(() => setIsPremium(false));
	}, [user]);

	const handleAddSeeker = async (form) => {
		startLoadingWithProgress(2000); // Start loading progress for adding seeker

		try {
			const res = await axios.post(`${API_URL}/api/seekers`, form);
			const created = res.data;
			setShowAddModal(false);
			if (created && created.id) {
				completeLoading(); // Complete loading when done
				// Navigate to the new seeker's page
				navigate(`/seekers/${created.id}`);
				return;
			}
			// If no ID returned, refresh the data instead of reloading the page
			window.location.reload();
		} catch (error) {
			completeLoading(); // Complete loading even on error
			console.error('Error adding seeker:', error);
			alert(content.errorAddingSeeker.value);
		}
	};

	// Check newsletter subscription status
	const checkNewsletterSubscription = async () => {
		if (!user?.primaryEmailAddress?.emailAddress) {
			setIsNewsletterSubscribed(false);
			return;
		}

		try {
			const response = await axios.get(
				`${API_URL}/api/newsletter/check-subscription`,
				{
					params: { email: user.primaryEmailAddress.emailAddress },
				},
			);

			setIsNewsletterSubscribed(response.data.isSubscribed);
		} catch (error) {
			console.error('Error checking newsletter subscription:', error);
			setIsNewsletterSubscribed(false);
		}
	};

	useEffect(() => {
		checkNewsletterSubscription();
	}, [user]);

	return (
		<>
			<Helmet>
				<title>
					{currentPage > 1
						? `${content.seekersHelmet.value} - Страница ${currentPage}`
						: content.seekersHelmet.value}
				</title>
				<meta name="description" content={content.seekersDescription.value} />
			</Helmet>
			<AddSeekerModal
				show={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={handleAddSeeker}
			/>
			<SeekerFilterModal
				open={showFilterModal}
				onClose={() => setShowFilterModal(false)}
				onApply={handleFilterApply}
				currentFilters={filters}
			/>

			<div
				className="container"
				style={{ paddingTop: '100px' }}
				key={`seekers-container-${currentPage}`}
			>
				{/* Database update badge */}
				<div
					className="alert alert-primary d-flex align-items-center gap-2 mb-4"
					role="alert"
					style={{
						borderRadius: '8px',
						border: '1px solid #0d6efd',
						backgroundColor: '#e7f1ff',
					}}
				>
					<i
						className="bi bi-info-circle text-primary"
						style={{ fontSize: '1.1rem' }}
					></i>
					<div>
						<strong className="text-primary">
							{content.seekersDatabaseUpdate.value}
						</strong>
						<div
							className="text-primary"
							style={{ fontSize: '0.9rem', marginTop: '2px', opacity: '0.8' }}
						>
							{content.seekersDatabaseUpdateDescription.value}
						</div>
						<div
							className="text-primary"
							style={{ fontSize: '0.9rem', marginTop: '8px', opacity: '0.9' }}
						>
							{content.seekersAddYourself.value}
						</div>
					</div>
				</div>

				{/* Mobile-optimized header */}
				<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3 seekers-header">
					<div className="d-flex align-items-center gap-3">
						<h2 className="fs-4 mb-0">{content.seekers.value}</h2>
					</div>
					<div
						className="d-flex flex-wrap gap-2 seekers-buttons"
						style={{ minWidth: 'fit-content' }}
					>
						<button
							className="btn btn-outline-primary d-flex align-items-center gap-2 seekers-btn"
							onClick={() => setShowFilterModal(true)}
							style={{
								height: 'auto',
								fontSize: '14px',
								padding: '8px 12px',
								minHeight: '40px',
								whiteSpace: 'nowrap',
							}}
						>
							<i className="bi bi-gear" style={{ fontSize: '16px' }}></i>
							<span>{content.filters.value}</span>
						</button>
						<button
							className={`btn d-flex align-items-center gap-2 seekers-btn ${isNewsletterSubscribed ? 'btn-outline-primary' : 'btn-outline-primary'}`}
							onClick={() => navigate('/newsletter')}
							style={{
								height: 'auto',
								fontSize: '14px',
								padding: '8px 12px',
								minHeight: '40px',
								whiteSpace: 'nowrap',
							}}
						>
							<i
								className={`bi ${isNewsletterSubscribed ? 'bi-check-circle-fill' : 'bi-envelope'}`}
								style={{ fontSize: '16px' }}
							></i>
							<span>{content.newsletter.value}</span>
						</button>
						{isAdmin && (
							<button
								className="btn btn-primary d-flex align-items-center gap-2 seekers-btn"
								onClick={() => setShowAddModal(true)}
								style={{
									height: 'auto',
									fontSize: '14px',
									padding: '8px 12px',
									minHeight: '40px',
									whiteSpace: 'nowrap',
								}}
							>
								<span>+ {content.addSeeker.value}</span>
							</button>
						)}
						{isAdmin && (
							<>
								{!deleteMode && (
									<button
										className="btn btn-danger d-flex align-items-center gap-2 seekers-btn"
										onClick={handleStartDeleteMode}
										style={{
											height: 'auto',
											fontSize: '14px',
											padding: '8px 12px',
											minHeight: '40px',
											whiteSpace: 'nowrap',
										}}
									>
										<i className="bi bi-trash" style={{ fontSize: '16px' }}></i>
										<span>{content.deleteSeeker.value}</span>
									</button>
								)}
								{deleteMode && (
									<>
										<button
											className="btn btn-danger d-flex align-items-center gap-2 seekers-btn"
											disabled={selectedIds.length === 0}
											onClick={handleConfirmDelete}
											style={{
												height: 'auto',
												fontSize: '14px',
												padding: '8px 12px',
												minHeight: '40px',
												whiteSpace: 'nowrap',
											}}
										>
											<i
												className="bi bi-check-circle"
												style={{ fontSize: '16px' }}
											></i>
											<span>{content.confirmDelete.value}</span>
										</button>
										<button
											className="btn btn-secondary d-flex align-items-center gap-2 seekers-btn"
											onClick={handleCancelDeleteMode}
											style={{
												height: 'auto',
												fontSize: '14px',
												padding: '8px 12px',
												minHeight: '40px',
												whiteSpace: 'nowrap',
											}}
										>
											<i
												className="bi bi-x-circle"
												style={{ fontSize: '16px' }}
											></i>
											<span>{content.cancel.value}</span>
										</button>
									</>
								)}
							</>
						)}
					</div>
				</div>

				{loading && (
					<div className="table-responsive">
						<table className="table table-bordered table-hover">
							<thead>
								<tr className="table-light">
									{isAdmin && deleteMode && <th style={{ width: '40px' }}></th>}
									<th style={{ minWidth: '120px' }}>
										{content.seekersTableName.value}
									</th>
									<th style={{ minWidth: '120px' }}>
										{content.seekersTableContact.value}
									</th>
									<th style={{ minWidth: '100px' }}>
										{content.seekersTableCity.value}
									</th>
									<th style={{ minWidth: '200px' }}>
										{content.seekersTableDescription.value}
									</th>
								</tr>
							</thead>
							<tbody>
								{[...Array(10)].map((_, idx) => (
									<tr key={idx} className="py-3">
										{isAdmin && deleteMode && (
											<td className="py-3 text-center">
												<Skeleton height={20} width={20} />
											</td>
										)}
										<td className="py-3">
											<Skeleton height={20} width={75} />
										</td>
										<td className="py-3">
											<Skeleton height={20} width={50} />
										</td>
										<td className="py-3">
											<Skeleton height={20} width={50} />
										</td>
										<td className="py-3">
											<Skeleton height={20} width={480} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{error && (
					<div
						className="alert alert-danger d-flex align-items-center gap-2"
						role="alert"
					>
						<i className="bi bi-exclamation-triangle"></i>
						<span>{error}</span>
					</div>
				)}
				{!loading &&
					seekers.length === 0 &&
					(!pagination || pagination.totalCount === 0) && (
						<div className="text-center py-5 empty-state">
							<div className="mb-3">
								<i
									className="bi bi-people"
									style={{ fontSize: '3rem', color: '#6c757d' }}
								></i>
							</div>
							<h5 className="text-muted">{content.noSeekersFound.value}</h5>
							<p className="text-muted">{content.noSeekersDescription.value}</p>
						</div>
					)}
				{!loading &&
					seekers.length === 0 &&
					pagination &&
					pagination.totalCount > 0 && (
						<div className="text-center py-5">
							<div className="mb-3">
								<i
									className="bi bi-people"
									style={{ fontSize: '3rem', color: '#6c757d' }}
								></i>
							</div>
							<h5 className="text-muted">
								{Object.keys(filters).length > 0 &&
								Object.values(filters).some(
									(v) => v !== '' && v !== undefined && v !== false,
								)
									? content.noSeekersMatchingFilters.value
									: content.noSeekersOnPage.value}
							</h5>
							<p className="text-muted">
								{content.totalSeekers.value} {pagination.totalCount}.
								{Object.keys(filters).length > 0 &&
								Object.values(filters).some(
									(v) => v !== '' && v !== undefined && v !== false,
								)
									? content.tryChangingFilters.value
									: content.goToAnotherPage.value}
							</p>
							<PaginationControl
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
							{currentPage > 1 && (
								<div className="mt-3">
									<button
										className="btn btn-outline-primary"
										onClick={() => handlePageChange(1)}
									>
										<i className="bi bi-arrow-left"></i>{' '}
										{content.returnToFirstPage.value}
									</button>
								</div>
							)}
						</div>
					)}
				{!loading &&
					(seekers.length > 0 || (pagination && pagination.totalCount > 0)) && (
						<>
							{pagination && pagination.totalCount > 0 && (
								<div className="d-flex justify-content-between align-items-center mb-3">
									<div className="d-flex align-items-center gap-3">
										<small className="text-muted">
											{content.showingSeekers.value} {seekers.length}{' '}
											{content.ofSeekers.value} {pagination.totalCount}{' '}
											{content.seekersCount.value}
										</small>
										{Object.keys(filters).length > 0 &&
											Object.values(filters).some(
												(v) => v !== '' && v !== undefined && v !== false,
											) && (
												<span className="badge bg-info text-white">
													<i className="bi bi-funnel"></i>{' '}
													{content.filtersAppliedBadge.value}
												</span>
											)}
									</div>
									{totalPages > 1 && (
										<small className="text-muted">
											<i className="bi bi-arrow-left-right"></i>{' '}
											{content.usePaginationForNavigation.value}
											{totalPages > 10 && (
												<span className="ms-2 text-warning">
													<i className="bi bi-exclamation-triangle"></i>{' '}
													{content.manyPagesWarning.value}
												</span>
											)}
										</small>
									)}
								</div>
							)}
							<div
								className="table-responsive"
								key={`seekers-table-${currentPage}`}
							>
								<table className="table table-bordered table-hover">
									<thead>
										<tr className="table-light">
											{isAdmin && deleteMode && (
												<th style={{ width: '40px' }} className="text-center">
													<input
														type="checkbox"
														checked={
															selectedIds.length === seekers.length &&
															seekers.length > 0
														}
														onChange={handleSelectAll}
														style={{ transform: 'scale(1.2)' }}
													/>
												</th>
											)}
											<th style={{ minWidth: '120px' }}>
												{content.seekersTableName.value}
											</th>
											<th style={{ minWidth: '120px' }}>
												{content.seekersTableContact.value}
											</th>
											<th style={{ minWidth: '100px' }}>
												{content.seekersTableCity.value}
											</th>
											<th style={{ minWidth: '200px' }}>
												{content.seekersTableDescription.value}
											</th>
										</tr>
									</thead>
									<tbody key={`seekers-tbody-${currentPage}`}>
										{currentSeekers.map((seeker, index) => (
											<tr
												key={seeker.id}
												className={seeker.isDemanded ? 'table-primary' : ''}
											>
												{isAdmin && deleteMode && (
													<td className="py-3 text-center">
														<input
															type="checkbox"
															checked={selectedIds.includes(seeker.id)}
															onChange={() => handleSelect(seeker.id)}
															style={{ transform: 'scale(1.2)' }}
														/>
													</td>
												)}
												<td className="py-3">
													<Link
														to={`/seekers/${seeker.id}`}
														state={{
															seekerIds: seekers.map((s) => s.id),
															currentIndex: index,
															returnToPage: currentPage,
														}}
														style={{
															color: '#1976d2',
															textDecoration: 'underline',
															cursor: 'pointer',
															fontWeight: '500',
														}}
													>
														{seeker.name}
													</Link>
												</td>
												<td className="py-3">
													{renderContactCell(
														seeker.contact,
														isPremium,
														seeker.id,
														seekers.map((s) => s.id),
														index,
														seeker.facebook,
														currentPage,
													)}
												</td>
												<td className="py-3">
													<span
														className="badge bg-light text-dark"
														style={{ padding: '2px 6px', fontSize: '11px' }}
													>
														{seeker.city}
													</span>
												</td>
												<td className="py-3">
													<div
														className="description-cell"
														style={{
															maxWidth: '100%',
															wordBreak: 'break-word',
															fontSize: '14px',
															lineHeight: '1.4',
														}}
													>
														{seeker.description}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{totalPages > 1 && (
								<PaginationControl
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</>
					)}
			</div>
		</>
	);
}
