import React from "react";
import { Link, useLocation } from "react-router-dom";

const UserLanding = () => {
  const location = useLocation();
  const welcomeMessage = location.state?.message || "Welcome!";

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-50 text-center">
        <h2>{welcomeMessage}</h2>
        <Link to="/">Go back to Login</Link>
      </div>
    </div>
  );
};

export default UserLanding;
