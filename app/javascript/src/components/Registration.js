import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registerUser] = useMutation(REGISTER_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser({ variables: { email, password, passwordConfirmation } });
    if (response.data.registerUser.user) {
      setSuccessMessage('Registration successful! You can now log in.');
      setErrorMessage('');
    } else if (response.data.registerUser.errors.length > 0) {
      setErrorMessage(response.data.registerUser.errors.join(', '));
      setSuccessMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-25">
        <h2>Register</h2>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
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
          <button type="submit" className="btn btn-primary mt-3">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
