import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthContext } from '../../context/authContext';
import Login from '../Login';
import { LOGIN_USER } from '../../graphql/mutations/loginUser';
import { useNavigate } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    search: '',
    pathname: '/login',
  }),
}));

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

describe('Login Component', () => {
  const mocks = [
    {
      request: {
        query: LOGIN_USER,
        variables: { email: 'test@test.com', password: 'password', rememberMe: false },
      },
      result: {
        data: {
          loginUser: {
            user: { id: '1', email: 'test@test.com' },
            token: 'some-token',
            errors: [],
          },
        },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  test('handles login successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <Login />
        </AuthContext.Provider>
      </MockedProvider>
    );

    // Update placeholders to match what is in the component
    fireEvent.change(screen.getByPlaceholderText('Type your email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Type your password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'some-token');
      expect(mockNavigate).toHaveBeenCalledWith('/recipes-finder');
    });
  });

  test('displays error message on login failure', async () => {
    const errorMocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: { email: 'test@test.com', password: 'wrong-password', rememberMe: false },
        },
        result: {
          data: {
            loginUser: {
              user: null,
              token: null,
              errors: ['Invalid credentials'],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <Login />
        </AuthContext.Provider>
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Type your email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Type your password'), { target: { value: 'wrong-password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
