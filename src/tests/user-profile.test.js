/* eslint-disable no-unused-vars */
/* global test, expect */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserHeader from '../components/UserHeader';

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
};

test('renders UserHeader correctly', () => {
  const { getByText, getByAltText } = render(
    <UserHeader
      user={mockUser}
      profileImage="/images/default-avatar.png"
      loading={false}
      setImageError={() => {}}
    />
  );

  expect(getByText('John Doe')).toBeInTheDocument();
  expect(getByText('john.doe@example.com')).toBeInTheDocument();
  expect(getByAltText('User Avatar')).toBeInTheDocument();
});