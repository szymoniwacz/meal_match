import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import LanguageSwitcher from './LanguageSwitcher';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const Navbar = ({ recipeFinderRef }) => {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">MealMatch</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {!isAuthenticated && location.pathname !== '/' && (
              <li className="nav-item">
                <Link className="nav-link" to="/">{t('Login')}</Link>
              </li>
            )}
            {!isAuthenticated && location.pathname === '/' && (
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
          <div className="ms-auto d-flex">
            <LanguageSwitcher recipeFinderRef={recipeFinderRef} />
            {isAuthenticated && (
              <>
                <button className="btn btn-danger" onClick={logout}>{t('auth.logout')}</button>
              </>
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
