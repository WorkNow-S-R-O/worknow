import { useIntlayer } from 'react-intlayer';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
	const content = useIntlayer('accessDeniedPage');

	return (
		<div className="h-screen flex justify-center items-center flex-col">
			<img
				className="w-full md:w-1/3"
				src="/images/padlock.jpg"
				alt="access-denied"
			/>
			<p className="md:text-3xl text-sm">{content.accessDenied.value}</p>
			<Link
				to="/"
				className="btn btn-primary mt-4 md:mt-6 text-white no-underline"
			>
				<h1 className="md:text-2xl text-sm">{content.backToHome.value}</h1>
			</Link>
		</div>
	);
}
