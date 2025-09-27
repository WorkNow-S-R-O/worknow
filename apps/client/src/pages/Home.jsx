import { JobListing } from '@/components';
import { Helmet } from 'react-helmet-async';
import { useIntlayer } from 'react-intlayer';

function Home() {
	const content = useIntlayer('home');

	return (
		<div className="flex flex-col min-h-screen">
			<Helmet>
				<title>{content.title.value}</title>
				<meta name="description" content={content.description.value} />
				<meta name="keywords" content={content.keywords.value} />
				<meta property="og:title" content={content.ogTitle.value} />
				<meta property="og:description" content={content.ogDescription.value} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://worknow.co.il/" />
				<meta
					property="og:image"
					content="https://worknow.co.il/images/logo.svg"
				/>
				<meta property="og:locale" content="ru_RU" />
				<meta property="og:locale:alternate" content="he_IL" />
				<meta property="og:locale:alternate" content="en_US" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={content.twitterTitle.value} />
				<meta
					name="twitter:description"
					content={content.twitterDescription.value}
				/>
				<meta
					name="twitter:image"
					content="https://worknow.co.il/images/logo.svg"
				/>
				<meta name="geo.region" content="IL" />
				<meta name="geo.placename" content="Israel" />
				<meta name="geo.position" content="31.0461;34.8516" />
				<link rel="alternate" href="https://worknow.co.il/" hrefLang="ru" />
				<link rel="alternate" href="https://worknow.co.il/he" hrefLang="he" />
				<link rel="alternate" href="https://worknow.co.il/en" hrefLang="en" />
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Organization',
						name: 'WorkNow',
						url: 'https://worknow.co.il/',
						logo: 'https://worknow.co.il/images/logo.svg',
						description: content.organizationDescription.value,
						address: {
							'@type': 'PostalAddress',
							addressCountry: 'IL',
						},
						sameAs: [
							'https://t.me/worknow',
							'https://www.facebook.com/worknow',
						],
					})}
				</script>
			</Helmet>
			<main className="flex-1">
				<JobListing />
			</main>
		</div>
	);
}

export default Home;
