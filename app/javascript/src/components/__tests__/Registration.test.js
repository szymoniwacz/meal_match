import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Registration from '../Registration';
import { REGISTER_USER } from '../../graphql/mutations/registerUser';

describe('Registration Component', () => {
  const mocks = [
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        },
      },
      result: {
        data: {
          registerUser: {
            user: { id: '1', email: 'test@test.com' },
            errors: [],
          },
        },
      },
    },
  ];


  const errorMocks = [
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        },
      },
      result: {
        data: {
          registerUser: {
            user: null,
            errors: ['Email already exists'],
          },
        },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Registration />
      </MockedProvider>
    );

    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Password/i)[0]).toBeInTheDocument(); // First occurrence is "Password"
    expect(screen.getAllByPlaceholderText(/Password/i)[1]).toBeInTheDocument(); // Second occurrence is "Confirm Password"
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Registration />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[1], {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Email already exists/i)).not.toBeInTheDocument();
  });

  test('displays error message on registration failure', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Registration />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[1], {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Registration successful/i)).not.toBeInTheDocument();
  });
});
