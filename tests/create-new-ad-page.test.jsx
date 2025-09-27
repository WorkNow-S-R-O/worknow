import { render } from '@testing-library/react';
import { createNewAdContent } from '@mocks/pagesContent.js';
import CreateNewAd from '../apps/client/src/pages/CreateNewAd.jsx';

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'createNewAd') {
			return createNewAdContent;
		}
		return {};
	},
}));

vi.mock('@/components/form', () => ({
	JobForm: () => <div data-testid="job-form" />,
}));

describe('CreateNewAd page', () => {
	it('sets page metadata and renders job form', () => {
		const { container, getByTestId } = render(<CreateNewAd />);

		expect(getByTestId('job-form')).toBeInTheDocument();

		const title = container.querySelector('title');
		expect(title?.textContent).toBe(
			createNewAdContent.createNewAdvertisementTab.value,
		);

		const descriptionMeta = container.querySelector('meta[name="description"]');
		expect(descriptionMeta).toHaveAttribute(
			'content',
			createNewAdContent.createNewAdvertisementDescription.value,
		);
	});
});
