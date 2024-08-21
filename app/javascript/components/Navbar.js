import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Base</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {!isAuthenticated && location.pathname !== '/register' && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            )}
            {!isAuthenticated && location.pathname === '/register' && (
              <li className="nav-item">
                <Link className="nav-link" to="/">Login</Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
