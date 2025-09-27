import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';
import { useIntlayer } from 'react-intlayer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUser } from '@clerk/clerk-react';
import { JobCard, PaginationControl } from '@/components';
import { useLoadingProgress } from '@/hooks';

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
	const content = useIntlayer('userProfile');
	const { user: clerkUser, isLoaded } = useUser();
	const [user, setUser] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const jobsPerPage = 5;
	const { clerkUserId } = useParams();
	const { startLoadingWithProgress, completeLoading, stopLoadingImmediately } =
		useLoadingProgress();

	const fetchJobs = async (page) => {
		try {
			const response = await axios.get(
				`${API_URL}/api/users/user-jobs/${clerkUserId}?page=${page}&limit=${jobsPerPage}`,
			);
			// Jobs data received from server
			setJobs(response.data.jobs);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error('Ошибка загрузки объявлений:', error);
		}
	};

	const fetchProfileData = async () => {
		try {
			startLoadingWithProgress(2000); // Start progress bar for 2 seconds

			const timestamp = new Date().getTime();
			const userResponse = await axios.get(
				`${API_URL}/api/users/${clerkUserId}?t=${timestamp}`,
			);

			if (!userResponse.data || !userResponse.data.firstName) {
				console.warn('⚠️ Пользователь не найден или данные профиля пустые!');
				setUser(null);
			} else {
				setUser(userResponse.data);
			}

			await fetchJobs(currentPage);
			completeLoading(); // Complete the progress bar
		} catch (error) {
			console.error('❌ Ошибка загрузки данных профиля:', error);
			setUser(null);
			stopLoadingImmediately(); // Stop progress bar on error
		} finally {
			setLoading(false);
		}
	};

	// Добавляем эффект для обновления при возвращении фокуса и смене аватарки
	useEffect(() => {
		const handleFocus = () => {
			fetchProfileData();
		};
		const handleAvatarChanged = () => {
			fetchProfileData();
		};

		window.addEventListener('focus', handleFocus);
		window.addEventListener('avatarChanged', handleAvatarChanged);
		return () => {
			window.removeEventListener('focus', handleFocus);
			window.removeEventListener('avatarChanged', handleAvatarChanged);
		};
	}, []);

	// Основной эффект для загрузки данных
	useEffect(() => {
		fetchProfileData();
	}, [clerkUserId, currentPage]);

	const handlePageChange = (pageNumber) => {
		if (pageNumber !== currentPage) {
			setCurrentPage(pageNumber);
		}
	};

	// Определяем, просматривает ли пользователь свой профиль
	const isOwnProfile = isLoaded && clerkUser && clerkUser.id === clerkUserId;

	// Если это свой профиль — используем данные из Clerk
	const profileData = isOwnProfile
		? {
				name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
				email:
					clerkUser.primaryEmailAddress?.emailAddress ||
					clerkUser.emailAddresses?.[0]?.emailAddress ||
					'',
				imageUrl: clerkUser.imageUrl,
			}
		: user;

	const pageTitle = profileData
		? `${profileData.name || ''} | ${content.user_profile_title} - WorkNow`
		: `${content.user_not_found} | WorkNow`;

	const pageDescription = profileData
		? `${content.profile_description}: ${profileData.name}. ${content.user_jobs}: ${jobs.length}.`
		: content.user_profile_not_found_description;

	const profileImage = profileData?.imageUrl || '/images/default-avatar.png';
	const profileUrl = `https://worknow.co.il/user/${clerkUserId}`;

	// Создаем SEO-разметку отдельно, чтобы избежать мутации данных
	const jobPostingSchema = jobs.map((job) => ({
		'@type': 'JobPosting',
		title: job.title,
		description: job.description,
		hiringOrganization: {
			'@type': 'Organization',
			name: 'WorkNow',
			sameAs: 'https://worknow.co.il',
		},
		jobLocation: {
			'@type': 'Place',
			address: {
				'@type': 'PostalAddress',
				addressLocality: job.city?.name || 'Не указано',
				addressCountry: 'IL',
			},
		},
		jobCategory: job.category?.name || 'Не указано',
	}));

	return (
		<>
			{/* 🔹 SEO-оптимизация */}
			<Helmet>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={pageDescription} />
				<meta property="og:url" content={profileUrl} />
				<meta property="og:type" content="profile" />
				<meta property="og:image" content={profileImage} />
				<meta name="robots" content="index, follow" />

				{/* 🔹 Schema.org разметка (Person + JobPosting) */}
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Person',
						name: profileData
							? `${profileData.firstName} ${profileData.lastName || ''}`
							: 'Пользователь',
						image: profileImage,
						url: profileUrl,
						email: profileData?.email || 'Не указано',
						jobTitle: 'Работодатель',
						worksFor: {
							'@type': 'Organization',
							name: 'WorkNow',
							sameAs: 'https://worknow.co.il',
						},
						hasOfferCatalog: jobPostingSchema,
					})}
				</script>
			</Helmet>

			<div className="container mt-20 d-flex flex-column align-items-center text-center">
				{loading ? (
					<SkeletonLoader jobsPerPage={jobsPerPage} />
				) : !profileData ? (
					<p>{content.user_not_found}</p>
				) : (
					<>
						<h4 className="text-primary">{content.user_jobs}</h4>
						{jobs.length === 0 ? (
							<p>{content.user_no_jobs}</p>
						) : (
							<>
								{jobs.map((job) => (
									<JobCard key={job.id} job={job} />
								))}
								<PaginationControl
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							</>
						)}
					</>
				)}
			</div>
		</>
	);
};

// Компонент заглушки (скелетон)
const SkeletonLoader = ({ jobsPerPage }) => (
	<>
		<h4>
			<Skeleton width={200} height={24} />
		</h4>
		{Array.from({ length: jobsPerPage }).map((_, index) => (
			<div
				key={index}
				className="card mb-3 w-75 text-start"
				style={{ maxWidth: '700px' }}
			>
				<div className="card-body">
					<Skeleton height={24} width="50%" />
					<Skeleton height={18} width="90%" className="mt-2" />
					<Skeleton height={18} width="60%" className="mt-2" />
					<Skeleton height={15} width="100%" className="mt-3" />
					<Skeleton height={15} width="100%" />
					<Skeleton height={15} width="80%" />
				</div>
			</div>
		))}
	</>
);

SkeletonLoader.propTypes = {
	jobsPerPage: PropTypes.number.isRequired,
};

export default UserProfile;
