/* eslint-disable no-unused-vars */
/* global test, expect, jest */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserHeader from '../apps/client/src/components/UserHeader';

const baseProps = {
  loading: false,
  setImageError: jest.fn(),
};

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  imageUrl: '',
};

test('renders UserHeader correctly', () => {
  const { getByText, getByAltText, asFragment } = render(
    <UserHeader
      user={mockUser}
      profileImage="/images/default-avatar.png"
      {...baseProps}
    />
  );

  expect(getByText('John Doe')).toBeInTheDocument();
  expect(getByText('john.doe@example.com')).toBeInTheDocument();
  expect(getByAltText('User Avatar')).toBeInTheDocument();

  // 🔍 Snapshot
  expect(asFragment()).toMatchSnapshot();
});

test('renders default avatar when profileImage is empty', () => {
  const { getByAltText } = render(
    <UserHeader
      user={mockUser}
      profileImage=""
      {...baseProps}
    />
  );

  const avatar = getByAltText('User Avatar');
  expect(avatar).toBeInTheDocument();
  expect(avatar.src).toContain('/images/default-avatar.png');
});

test('renders fallback name when firstName is missing', () => {
  const user = { ...mockUser, firstName: '', lastName: '' };
  const { getByText } = render(
    <UserHeader user={user} profileImage="" {...baseProps} />
  );

  expect(getByText('Анонимный пользователь')).toBeInTheDocument();
});

test('renders fallback email when email is missing', () => {
  const user = { ...mockUser, email: '' };
  const { getByText } = render(
    <UserHeader user={user} profileImage="" {...baseProps} />
  );

  expect(getByText('Email не указан')).toBeInTheDocument();
});

test('renders fallback name and email when both are missing', () => {
  const user = {
    firstName: '',
    lastName: '',
    email: '',
    imageUrl: '',
  };

  const { getByText } = render(
    <UserHeader user={user} profileImage="" {...baseProps} />
  );

  expect(getByText('Анонимный пользователь')).toBeInTheDocument();
  expect(getByText('Email не указан')).toBeInTheDocument();
});