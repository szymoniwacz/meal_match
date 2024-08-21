import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    registerUser(input: { email: $email, password: $password, passwordConfirmation: $passwordConfirmation }) {
      user {
        id
        email
      }
      errors
    }
  }
`;

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registerUser, { data, error }] = useMutation(REGISTER_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser({ variables: { email, password, passwordConfirmation } });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Register</button>
        </form>
        {data && data.registerUser.errors.length > 0 && (
          <div className="mt-3">
            <h3>Errors</h3>
            <ul>
              {data.registerUser.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-3">
          <Link to="/">Go to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
