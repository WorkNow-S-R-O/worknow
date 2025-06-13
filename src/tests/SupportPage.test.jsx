import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SupportPage from '../components/SupportPage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('../components/Navbar', () => ({ Navbar: () => <div>Navbar</div> }));
jest.mock('../components/Footer', () => ({ Footer: () => <div>Footer</div> }));

test('renders SupportPage without crashing', () => {
  const { getByText } = render(<SupportPage />);
  expect(getByText('email_support')).toBeInTheDocument();
});

test('SupportPage matches snapshot', () => {
  const { asFragment } = render(<SupportPage />);
  expect(asFragment()).toMatchSnapshot();
}); 