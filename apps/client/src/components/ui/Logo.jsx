import { Link } from 'react-router-dom';

const Logo = ({ isMobile = false }) => {
	const logoClass = isMobile ? 'w-12 me-2' : 'logo-img';
	const titleClass = isMobile ? 'text-3xl m-0' : 'logo-text';
	const containerClass = isMobile
		? 'navbar-brand d-flex align-items-center'
		: 'd-flex align-items-center no-underline text-black p-0 m-0';
	const containerStyle = isMobile ? {} : { gap: '6px' };

	return (
		<Link className={containerClass} to="/" style={containerStyle}>
			<img className={logoClass} src="/images/logo.svg" alt="Logo" />
			<h1 className={titleClass}>worknow</h1>
		</Link>
	);
};

export default Logo;
