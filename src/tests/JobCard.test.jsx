import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCard from '../components/JobCard';

// Мокаем useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
// Мокаем только useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));
// Мокаем Spinner из react-bootstrap
jest.mock('react-bootstrap/Spinner', () => () => <div>Spinner</div>);

const mockJob = {
  id: 1,
  title: 'Test Job',
  salary: '1000',
  city: { name: 'Москва' },
  description: 'Описание работы',
  phone: '+79999999999',
  user: {
    clerkUserId: '123',
    imageUrl: '/images/default-avatar.png',
    isPremium: false,
    name: 'Иван Иванов',
  },
};

test('renders JobCard without crashing', () => {
  const { getByText } = render(
    <JobCard job={mockJob} />
  );
  expect(getByText('Test Job')).toBeInTheDocument();
  expect(getByText('Описание работы')).toBeInTheDocument();
});

test('JobCard matches snapshot', () => {
  const { asFragment } = render(
    <JobCard job={mockJob} />
  );
  expect(asFragment()).toMatchSnapshot();
}); 