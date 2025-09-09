import { useIntlayer } from 'react-intlayer';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
	const content = useIntlayer('notFoundPage');

	return (
		<div className="h-screen flex justify-center items-center flex-col">
			<img className="w-full md:w-1/3" src="/images/404.jpg" alt="not-found" />
			<p className="md:text-3xl text-sm mt-4">{content.pageNotFound.value}</p>
			<Link
				to="/"
				className="btn btn-primary mt-4 md:mt-6 text-white no-underline"
			>
				<h1 className="md:text-2xl text-sm">{content.backToHome.value}</h1>
			</Link>
		</div>
	);
}
