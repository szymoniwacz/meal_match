import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthContext } from '../../context/authContext';
import Login from '../Login';
import { LOGIN_USER } from '../../graphql/mutations/loginUser';
import { useNavigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

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

  const renderLoginComponent = (language = 'en', mockResponses = mocks) => {
    i18n.changeLanguage(language);

    return render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mockResponses} addTypename={false}>
          <AuthContext.Provider value={{ login: mockLogin }}>
            <Login />
          </AuthContext.Provider>
        </MockedProvider>
      </I18nextProvider>
    );
  };

  test('handles login successfully', async () => {
    renderLoginComponent();

    fireEvent.change(screen.getByPlaceholderText('Type your email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Type your password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'some-token');
      expect(mockNavigate).toHaveBeenCalledWith('/recipes-finder');
    });
  });

  test('handles login successfully in French', async () => {
    renderLoginComponent('fr');

    fireEvent.change(screen.getByPlaceholderText('Tapez votre e-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Tapez votre mot de passe'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Connexion' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'some-token');
      expect(mockNavigate).toHaveBeenCalledWith('/recipes-finder');
    });
  });

  test('displays error message on login failure in French', async () => {
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
              errors: ['Identifiants invalides'],
            },
          },
        },
      },
    ];

    renderLoginComponent('fr', errorMocks);

    fireEvent.change(screen.getByPlaceholderText('Tapez votre e-mail'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Tapez votre mot de passe'), { target: { value: 'wrong-password' } });

    fireEvent.click(screen.getByRole('button', { name: 'Connexion' }));

    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides')).toBeInTheDocument();
    });
  });
});
