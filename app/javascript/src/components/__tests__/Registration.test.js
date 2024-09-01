import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import Registration from '../Registration';
import { REGISTER_USER } from '../../graphql/mutations/registerUser';
import i18n from '../../i18n';

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

  const setup = (language = 'en') => {
    i18n.changeLanguage(language);

    return render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={language === 'en' ? mocks : errorMocks} addTypename={false}>
          <Registration />
        </MockedProvider>
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form in English', () => {
    setup('en');

    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Password/i)[0]).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Confirm Password/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('renders registration form in French', () => {
    setup('fr');

    expect(screen.getByRole('heading', { name: /S'inscrire/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Mot de passe/i)[0]).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Confirmer le mot de passe/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });

  test('handles successful registration in English', async () => {
    setup('en');

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Confirm Password/i)[0], {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Email already exists/i)).not.toBeInTheDocument();
  });

  test('displays error message on registration failure in French', async () => {
    setup('fr');

    fireEvent.change(screen.getByPlaceholderText(/E-mail/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Mot de passe/i)[0], {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Confirmer le mot de passe/i)[0], {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/Inscription réussie/i)).not.toBeInTheDocument();
  });
});
