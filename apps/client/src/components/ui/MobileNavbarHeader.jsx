import { Link } from 'react-router-dom';
import { useIntlayer } from 'react-intlayer';
import { SignedIn } from '@clerk/clerk-react';
import LanguageSelector from './LanguageSelector';
import UserAuth from './UserAuth';
import PremiumButton from './premium-button';
import MailDropdown from './MailDropdown';
import Logo from './Logo';

const MobileNavbarHeader = ({ isExpanded, setIsExpanded }) => {
	const content = useIntlayer('navbar');

	return (
		<nav className="z-10 navbar navbar-expand-lg navbar-light bg-[#e3f2fd] d-lg-none fixed-top">
			<div className="container-fluid">
				<Logo isMobile={true} />

				<button
					className="navbar-toggler"
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					aria-controls="navbarNav"
					aria-expanded={isExpanded}
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div
					className={`navbar-collapse ${isExpanded ? 'show' : 'collapse'}`}
					id="navbarNav"
				>
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link className="nav-link text-lg font-normal" to="/">
								{content.vacancies.value}
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link text-lg font-normal" to="/seekers">
								{content.seekers.value}
							</Link>
						</li>
						<li className="nav-item">
							<Link
								className="nav-link text-lg font-normal"
								to="/my-advertisements"
							>
								{content.jobs.value}
							</Link>
						</li>
						{/* Dropdown Support */}
						<li className="nav-item dropdown">
							<button
								className="nav-link text-lg font-normal dropdown-toggle"
								type="button"
								id="mobileSupportDropdown"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								{content.support.value}
							</button>
							<ul
								className="dropdown-menu"
								aria-labelledby="mobileSupportDropdown"
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
							</ul>
						</li>
					</ul>

					<div className="d-flex flex-column gap-2 mt-3">
						<LanguageSelector isMobile={true} />
						<UserAuth isMobile={true} />
						<PremiumButton />
						<SignedIn>
							<MailDropdown />
						</SignedIn>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default MobileNavbarHeader;
