import { Helmet } from 'react-helmet-async';
import { useIntlayer } from 'react-intlayer';
import { Button } from '../components/ui/button';

function MyAds() {
	const content = useIntlayer('myAdsPage');

	return (
		<>
			<Helmet>
				<title>{content.myAds.value}</title>
				<meta name="description" content="My advertisements | WorkNow" />
			</Helmet>
			<Button />
		</>
	);
}

export default MyAds;
