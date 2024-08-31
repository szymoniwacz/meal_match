import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AuthContext } from '../../context/authContext';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockLogout = jest.fn();

  const renderNavbar = (isAuthenticated, pathname) => {
    useLocation.mockReturnValue({ pathname });
    render(
      <AuthContext.Provider value={{ isAuthenticated, userEmail: 'test@example.com', logout: mockLogout }}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('displays Login link when not authenticated and not on the home page', () => {
    renderNavbar(false, '/register');

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('displays Register link when not authenticated and on the home page', () => {
    renderNavbar(false, '/');

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('displays user email and Logout button when authenticated', () => {
    renderNavbar(true, '/');

    expect(screen.getByText('Logged in as: test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  test('calls logout function when Logout button is clicked', () => {
    renderNavbar(true, '/');

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
