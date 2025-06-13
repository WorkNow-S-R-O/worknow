import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SurveyWidget from '../components/SurveyWidget';

test('renders SurveyWidget without crashing', () => {
  const { getByText } = render(<SurveyWidget />);
  expect(getByText('Участвуйте в нашем опросе!')).toBeInTheDocument();
});

test('SurveyWidget matches snapshot', () => {
  const { asFragment } = render(<SurveyWidget />);
  expect(asFragment()).toMatchSnapshot();
}); 