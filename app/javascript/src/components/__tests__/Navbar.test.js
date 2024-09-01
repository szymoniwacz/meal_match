import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Navbar from '../Navbar';
import { AuthContext } from '../../context/authContext';
import { act } from 'react';

jest.mock('../LanguageSwitcher', () => {
  const MockLanguageSwitcher = () => <div>Mocked LanguageSwitcher</div>;
  MockLanguageSwitcher.displayName = 'MockLanguageSwitcher';
  return MockLanguageSwitcher;
});

describe('Navbar Component', () => {
  const renderWithProviders = ({ isAuthenticated, userEmail, logout, route }) => {
    const recipeFinderRef = React.createRef();  // Added mock recipeFinderRef
    return render(
      <MemoryRouter initialEntries={[route || '/']}>
        <I18nextProvider i18n={i18n}>
          <AuthContext.Provider value={{ isAuthenticated, userEmail, logout }}>
            <Navbar recipeFinderRef={recipeFinderRef} />
          </AuthContext.Provider>
        </I18nextProvider>
      </MemoryRouter>
    );
  };

  test('renders Navbar with Login link when not authenticated and not on home page', () => {
    renderWithProviders({
      route: '/some-other-page',
    });

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked LanguageSwitcher/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logged in as/i)).not.toBeInTheDocument();
  });

  test('renders Navbar with Register link when not authenticated and on home page', () => {
    renderWithProviders({
      isAuthenticated: false,
      route: '/',
    });

    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked LanguageSwitcher/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logged in as/i)).not.toBeInTheDocument();
  });

  test('renders Navbar with logged in user email and logout button when authenticated', () => {
    const mockLogout = jest.fn();

    renderWithProviders({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      logout: mockLogout,
      route: '/',
    });

    expect(screen.getByText(/Logged in as/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked LanguageSwitcher/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders correct text based on language change', () => {
    act(() => {
      i18n.changeLanguage('fr');
    });

    const { rerender } = renderWithProviders({
      isAuthenticated: false,
      route: '/',
    });

    expect(screen.getByText(/S'inscrire/i)).toBeInTheDocument(); // French translation for Register
    expect(screen.getAllByText(/Mocked LanguageSwitcher/i)).toHaveLength(1);

    act(() => {
      i18n.changeLanguage('en');
    });

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <AuthContext.Provider value={{ isAuthenticated: true, userEmail: 'test@example.com', logout: jest.fn() }}>
            <Navbar recipeFinderRef={React.createRef()} />
          </AuthContext.Provider>
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mocked LanguageSwitcher/i)).toHaveLength(1);
  });
});
