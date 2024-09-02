import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations/registerUser';

const Registration = () => {
  const { t } = useTranslation();

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
      setSuccessMessage(t('registration.success'));
      setErrorMessage('');
    } else if (response.data.registerUser.errors.length > 0) {
      setErrorMessage(response.data.registerUser.errors.join(', '));
      setSuccessMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-25">
        <h2>{t('auth.register')}</h2>
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
            <label>{t('auth.email')}:</label>
            <input
              type="email"
              className="form-control"
              placeholder={t('auth.placeholder.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t('auth.password')}:</label>
            <input
              type="password"
              className="form-control"
              placeholder={t('auth.placeholder.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t('registration.confirmPassword')}:</label>
            <input
              type="password"
              className="form-control"
              placeholder={t('registration.confirmPassword')}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {t('auth.register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
