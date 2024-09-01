import React, { useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { LOGIN_USER } from '../graphql/mutations/loginUser';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginUser] = useMutation(LOGIN_USER);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = new URLSearchParams(location.search).get('notice');
  const { t } = useTranslation();

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 3000);
    }
  }, [successMessage, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({ variables: { email, password, rememberMe } });
    if (response.data.loginUser.user) {
      login(response.data.loginUser.user.email, response.data.loginUser.token);
      navigate('/recipes-finder');
    } else if (response.data.loginUser.errors.length > 0) {
      setErrorMessage(response.data.loginUser.errors.join(', '));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-25">
        <h2>{t('Login')}</h2>
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
            <label>{t('Email')}:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              placeholder="Type your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t('Password')}:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              placeholder="Type your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe">{t('Remember me')}</label>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {t('Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
