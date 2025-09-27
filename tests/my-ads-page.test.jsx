import { render } from '@testing-library/react';
import { myAdsContent } from '@mocks/pagesContent.js';
import MyAds from '../apps/client/src/pages/MyAds.jsx';

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'myAdsPage') {
			return myAdsContent;
		}
		return {};
	},
}));

vi.mock('@/components/ui', () => ({
	Button: () => <button type="button" data-testid="my-ads-button">Button</button>,
}));

describe('MyAds page', () => {
	it('renders action button and sets document metadata', () => {
		const { container, getByTestId } = render(<MyAds />);

		expect(getByTestId('my-ads-button')).toBeInTheDocument();

		const title = container.querySelector('title');
		expect(title?.textContent).toBe(myAdsContent.myAds.value);

		const descriptionMeta = container.querySelector('meta[name="description"]');
		expect(descriptionMeta).toHaveAttribute(
			'content',
			'My advertisements | WorkNow',
		);
	});
});
