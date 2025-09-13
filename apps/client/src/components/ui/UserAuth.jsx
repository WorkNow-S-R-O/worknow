import { useIntlayer } from 'react-intlayer';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from '@clerk/clerk-react';

const UserAuth = ({ isMobile = false }) => {
	const content = useIntlayer('navbar');

	const signInButtonClass = isMobile 
		? 'btn btn-primary d-flex align-items-center justify-content-center'
		: 'btn btn-primary d-flex align-items-center';

	return (
		<div className={isMobile ? '' : 'd-flex ml-5'}>
			<SignedOut>
				<SignInButton>
					<span className={signInButtonClass}>
						<i className="bi bi-person-circle me-2"></i>
						{content.signIn.value}
					</span>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
};

export default UserAuth;
