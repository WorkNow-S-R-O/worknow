import { JobForm } from '@/components/form';
import { Helmet } from 'react-helmet-async';
import { useIntlayer } from 'react-intlayer';

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
