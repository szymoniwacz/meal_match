import React from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserLanding = () => {
  const location = useLocation();
  const welcomeMessage = location.state?.message || 'Welcome!';

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-50 text-center">
        <h2>{welcomeMessage}</h2>
      </div>
    </div>
  );
};

export default UserLanding;
