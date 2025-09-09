import { useClerk, useUser } from '@clerk/clerk-react';
import { useIntlayer } from 'react-intlayer';
import { useNavigate } from 'react-router-dom';
import UserJobs from '../UserJobs';

const Button = () => {
	const content = useIntlayer('button');
	const { user } = useUser();
	const { redirectToSignIn } = useClerk();
	const navigate = useNavigate();

	const handleCreateAdClick = () => {
		if (!user) {
			redirectToSignIn();
		} else {
			navigate('/create-new-advertisement');
		}
	};

	return (
		<div className="container mt-4">
			<div className="text-center mb-4">
				<button
					onClick={handleCreateAdClick}
					className="btn btn-primary btn-l h-16 mt-20 flex items-center justify-center"
				>
					<i className="bi bi-plus-circle-fill me-2"></i>
					{content.buttonCreateNewAdvertisement.value}
				</button>
			</div>

			{user ? (
				<UserJobs />
			) : (
				<div className="text-center mt-6">
					<div className="fs-4 mb-4">{content.messageLoginToViewAds.value}</div>
					<div className="mt-4">
						<img
							src="/images/man-login.jpg"
							alt="Worker illustration"
							className="img-fluid mobile-optimized-image"
							style={{
								width: '90vw',
								maxWidth: '500px',
								height: 'auto',
								borderRadius: '12px',
								margin: '0 auto',
								display: 'block',
								objectFit: 'contain',
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export { Button };
