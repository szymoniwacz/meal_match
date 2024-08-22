import React, { useState, useContext, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
      token
      errors
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginUser, { data, error }] = useMutation(LOGIN_USER);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = new URLSearchParams(location.search).get('notice');

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 3000); // Clear the success message after 3 seconds
    }
  }, [successMessage, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({ variables: { email, password } });
    if (response.data.loginUser.user) {
      login(response.data.loginUser.user.email, response.data.loginUser.token);
      navigate('/user-landing', { state: { message: 'Welcome back!' } });
    } else if (response.data.loginUser.errors.length > 0) {
      setErrorMessage(response.data.loginUser.errors.join(', '));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-25">
        <h2>Login</h2>
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
          <button type="submit" className="btn btn-primary mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
