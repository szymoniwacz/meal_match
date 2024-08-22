import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Registration from '../components/Registration';
import UserLanding from '../components/UserLanding';
import { AuthProvider, AuthContext } from '../components/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/user-landing" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/user-landing" /> : <Registration />} />
      <Route path="/user-landing" element={<ProtectedRoute element={UserLanding} />} />
    </Routes>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <ApolloProvider client={client}>
        <Router>
          <AuthProvider>
            <Navbar />
            <App />
          </AuthProvider>
        </Router>
      </ApolloProvider>
    );
  }
});
