import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import LanguageSwitcher from '../LanguageSwitcher';
import { SWITCH_LANGUAGE } from '../../graphql/mutations/switchLanguage';
import i18n from '../../i18n';

const mocks = [
  {
    request: {
      query: SWITCH_LANGUAGE,
      variables: { input: 'fr' },
    },
    result: {
      data: {
        switchLanguage: {
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: SWITCH_LANGUAGE,
      variables: { input: 'en' },
    },
    result: {
      data: {
        switchLanguage: {
          success: true,
        },
      },
    },
  },
];

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows French button when current language is English', () => {
    i18n.changeLanguage('en');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LanguageSwitcher />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /Français/i })).toBeInTheDocument();
  });

  test('shows English button when current language is French', () => {
    i18n.changeLanguage('fr');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LanguageSwitcher />
      </MockedProvider>
    );

    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
  });

  test('switches to French when French button is clicked', async () => {
    i18n.changeLanguage('en');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LanguageSwitcher />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Français/i }));

    await waitFor(() => expect(i18n.language).toBe('fr'));
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
  });

  test('switches to English when English button is clicked', async () => {
    i18n.changeLanguage('fr');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LanguageSwitcher />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /English/i }));

    await waitFor(() => expect(i18n.language).toBe('en'));
    expect(screen.getByRole('button', { name: /Français/i })).toBeInTheDocument();
  });
});
