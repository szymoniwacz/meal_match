import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = ({ recipeFinderRef }) => {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">MealMatch</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/' && (
              <li className="nav-item">
                <Link className="nav-link" to="/">{t('auth.login')}</Link>
              </li>
            )}
            {!isAuthenticated && location.pathname !== '/register' && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">{t('auth.register')}</Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <span className="navbar-text">{t('auth.loggedInAs')}: {userEmail}</span>
              </li>
            )}
          </ul>
          <div className="form-inline ml-auto">
            <LanguageSwitcher recipeFinderRef={recipeFinderRef} />
            {isAuthenticated && (
              <button className="btn btn-danger ml-2" onClick={logout}>{t('auth.logout')}</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  recipeFinderRef: PropTypes.object.isRequired,
};

export default Navbar;
