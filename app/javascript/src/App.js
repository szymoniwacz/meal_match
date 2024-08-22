import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Registration from './components/Registration';
import UserLanding from './components/UserLanding';
import { AuthContext } from './context/authContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/user-landing" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/user-landing" /> : <Registration />} />
        <Route path="/user-landing" element={<ProtectedRoute element={UserLanding} />} />
      </Routes>
    </>
  );
};

export default App;
