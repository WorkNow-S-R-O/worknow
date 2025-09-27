import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { accessDeniedContent } from '@mocks/pagesContent.js';
import AccessDenied from '../apps/client/src/pages/AccessDenied.jsx';

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'accessDeniedPage') {
			return accessDeniedContent;
		}
		return {};
	},
}));

describe('AccessDenied page', () => {
	it('displays localized message and back link', () => {
		render(
			<MemoryRouter>
				<AccessDenied />
			</MemoryRouter>,
		);

		expect(
			screen.getByRole('img', { name: /access-denied/i }),
		).toBeInTheDocument();
		expect(screen.getByText(accessDeniedContent.accessDenied.value)).toBeVisible();

		const backLink = screen.getByRole('link', {
			name: accessDeniedContent.backToHome.value,
		});
		expect(backLink).toHaveAttribute('href', '/');
	});
});
