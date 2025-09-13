import PropTypes from 'prop-types';
import JobCard from './JobCard';
import Skeleton from 'react-loading-skeleton';
import { useUser } from '@clerk/clerk-react';

const JobList = ({ jobs, loading }) => {
	const { user: clerkUser, isLoaded } = useUser();

	if (loading) {
		return (
			<>
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={index}
						className="card shadow-sm mb-4"
						style={{ width: '90%', maxWidth: '700px', minHeight: '220px' }}
					>
						<div className="card-body">
							<Skeleton height={30} width="70%" />
							<Skeleton height={20} width="90%" className="mt-2" />
							<Skeleton height={20} width="60%" className="mt-2" />
						</div>
					</div>
				))}
			</>
		);
	}

	if (!jobs || jobs.length === 0) {
		return <p className="text-muted mt-4">Объявлений не найдено</p>;
	}

	return jobs.map((job) => {
		const isOwnJob =
			isLoaded && clerkUser && job.user?.clerkUserId === clerkUser.id;
		return (
			<JobCard
				key={job.id}
				job={job}
				currentUserName={
					isOwnJob
						? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
						: undefined
				}
				currentUserImageUrl={isOwnJob ? clerkUser.imageUrl : undefined}
			/>
		);
	});
};

JobList.propTypes = {
	jobs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			salary: PropTypes.string,
			city: PropTypes.shape({
				name: PropTypes.string,
			}),
			description: PropTypes.string,
			phone: PropTypes.string,
			createdAt: PropTypes.string.isRequired,
			user: PropTypes.shape({
				clerkUserId: PropTypes.string,
				imageUrl: PropTypes.string,
				isPremium: PropTypes.bool,
			}),
		}),
	).isRequired,
	loading: PropTypes.bool.isRequired,
};

export default JobList;
