import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useIntlayer } from 'react-intlayer';
import { useLanguageManager } from '../hooks/useLanguageManager';
import PremiumButton from './ui/premium-button';
import LanguageSelector from './ui/LanguageSelector';
import UserAuth from './ui/UserAuth';
import MobileNavbarHeader from './ui/MobileNavbarHeader';
import Logo from './ui/Logo';
import { SignedIn } from '@clerk/clerk-react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MailDropdown from './ui/MailDropdown';

const Navbar = () => {
	const content = useIntlayer('navbar');
	const { clearLanguagePreference } = useLanguageManager();
	const location = useLocation();

	const [isExpanded, setIsExpanded] = useState(false);

	// Close mobile navbar when route changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: location object changes when route changes
	useEffect(() => {
		setIsExpanded(false);
	}, [location.pathname]);

	// Expose functions to window for testing
	useEffect(() => {
		window.resetLanguageDetection = clearLanguagePreference;
	}, [clearLanguagePreference]);

	return (
		<>
			{/* Desktop Version */}
			<div className="d-none d-lg-block mb-10">
				<div className="absolute top-0 left-0 w-full h-16 bg-[#e3f2fd]"></div>
				<div className="flex absolute top-0 left-0 m-3 items-center">
					<div className="logo-container">
						<Logo />
					</div>
					<ul className="flex justify-center items-center ml-0 gap-2 mb-2 text-gray-500">
						<li className="mr-3">
							<Link
								id="vacancies"
								to="/"
								className="nav-link text-base font-normal"
							>
								{content.vacancies.value}
							</Link>
						</li>
						<span className="nav-slash">/</span>
						<li className="mr-3">
							<Link
								id="seekers"
								to="/seekers"
								className="nav-link text-base font-normal"
							>
								{content.seekers.value}
							</Link>
						</li>
						<span className="nav-slash">/</span>
						<li className="mr-3">
							<Link
								id="jobs"
								to="/my-advertisements"
								className="nav-link text-base font-normal"
							>
								{content.jobs.value}
							</Link>
						</li>
						{/* Dropdown Support */}
						<span className="nav-slash">/</span>
						<li className="nav-item dropdown">
							<button
								className="nav-link text-base font-normal dropdown-toggle"
								type="button"
								id="supportDropdown"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								{content.support.value}
							</button>
							<ul
								id="supportDropdown"
								className="dropdown-menu mt-3 text-gray-600 "
								aria-labelledby="supportDropdown"
							>
								<li>
									<a
										href="https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca"
										className="dropdown-item"
										target="_blank"
										rel="noopener noreferrer"
									>
										{content.rules.value}
									</a>
								</li>
								<li>
									<Link to="/support" className="dropdown-item">
										{content.technicalSupport.value}
									</Link>
								</li>
								<li>
									<Link to="/billing" className="dropdown-item">
										{content.billing.value}
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				</div>

				<div className="d-flex align-items-center absolute top-0 right-0 m-3">
					<SignedIn>
						<MailDropdown />
					</SignedIn>
					<LanguageSelector />
					<PremiumButton />
					<UserAuth />
				</div>
			</div>

			{/* Mobile Version */}
			<MobileNavbarHeader 
				isExpanded={isExpanded} 
				setIsExpanded={setIsExpanded} 
			/>
		</>
	);
};

export { Navbar };
