import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Registration from './components/Registration';
import UserLanding from './components/UserLanding';
import RecipesFinder from './components/RecipesFinder';
import { AuthContext } from './context/authContext';

const ProtectedRoute = ({ element: Element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Element /> : <Navigate to="/" />;
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
        <Route path="/recipes-finder" element={<ProtectedRoute element={RecipesFinder} />} />
      </Routes>
    </>
  );
};

export default App;
