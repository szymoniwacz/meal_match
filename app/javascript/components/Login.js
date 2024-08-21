import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
      errors
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { data, error }] = useMutation(LOGIN_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ variables: { email, password } });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-25">
        <h2>Login</h2>
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
          <button type="submit" className="btn btn-primary mt-3">Login</button>
        </form>
        {data && data.loginUser.errors.length > 0 && (
          <div className="mt-3">
            <h3>Errors</h3>
            <ul>
              {data.loginUser.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-3">
          <Link to="/register">Go to Registration</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
