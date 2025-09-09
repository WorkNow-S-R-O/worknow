import { Helmet } from 'react-helmet-async';
import { useIntlayer } from 'react-intlayer';
import { JobForm } from '../components/index';

function CreateNewAd() {
	const content = useIntlayer('createNewAd');

	return (
		<>
			<Helmet>
				<title>{content.createNewAdvertisementTab.value}</title>
				<meta
					name="description"
					content={content.createNewAdvertisementDescription.value}
				/>
			</Helmet>
			<JobForm />
		</>
	);
}

export default CreateNewAd;
