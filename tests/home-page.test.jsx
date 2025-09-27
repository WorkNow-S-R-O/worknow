import { render } from '@testing-library/react';
import { homeContent } from '@mocks/pagesContent.js';
import Home from '../apps/client/src/pages/Home.jsx';

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'home') {
			return homeContent;
		}
		return {};
	},
}));

vi.mock('@/components', () => ({
	JobListing: () => <div data-testid="job-listing" />,
}));

describe('Home page', () => {
	it('renders job listing and exposes SEO metadata', () => {
		const { container, getByTestId } = render(<Home />);

		expect(getByTestId('job-listing')).toBeInTheDocument();

		const title = container.querySelector('title');
		expect(title?.textContent).toBe(homeContent.title.value);

		const description = container.querySelector('meta[name="description"]');
		expect(description).toHaveAttribute('content', homeContent.description.value);

		const jsonLd = container.querySelector('script[type="application/ld+json"]');
		expect(jsonLd).not.toBeNull();
		expect(jsonLd?.textContent).toContain(homeContent.organizationDescription.value);
	});
});
