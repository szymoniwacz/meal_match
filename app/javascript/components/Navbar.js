import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Base</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {!isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <span className="navbar-text">Logged in as: {userEmail}</span>
              </li>
            )}
          </ul>
          {isAuthenticated && (
            <button className="btn btn-danger ms-auto" onClick={logout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
