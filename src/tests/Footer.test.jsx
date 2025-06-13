import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '../components/Footer';

test('renders Footer without crashing', () => {
  const { getByText } = render(<Footer />);
  expect(getByText('Наш Telegram')).toBeInTheDocument();
});

test('Footer matches snapshot', () => {
  const { asFragment } = render(<Footer />);
  expect(asFragment()).toMatchSnapshot();
}); 