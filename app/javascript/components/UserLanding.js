import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserLanding = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const welcomeMessage = location.state?.message || 'Welcome!';

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-50 text-center">
        <h2>{welcomeMessage}</h2>
        <button onClick={logout} className="btn btn-danger mt-3">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserLanding;
