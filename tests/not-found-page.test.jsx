import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { notFoundContent } from '@mocks/pagesContent.js';
import NotFoundPage from '../apps/client/src/pages/NotFoundPage.jsx';

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'notFoundPage') {
			return notFoundContent;
		}
		return {};
	},
}));

describe('NotFoundPage', () => {
	it('renders 404 illustration and home link', () => {
		render(
			<MemoryRouter>
				<NotFoundPage />
			</MemoryRouter>,
		);

		expect(screen.getByRole('img', { name: /not-found/i })).toBeInTheDocument();
		expect(screen.getByText(notFoundContent.pageNotFound.value)).toBeVisible();

		const backLink = screen.getByRole('link', {
			name: notFoundContent.backToHome.value,
		});
		expect(backLink).toHaveAttribute('href', '/');
	});
});
