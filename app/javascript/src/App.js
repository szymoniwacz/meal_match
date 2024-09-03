import React, { useContext, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Registration from './components/Registration';
import RecipesFinder from './components/RecipesFinder';
import { AuthContext } from './context/authContext';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const recipeFinderRef = useRef();

  return (
    <>
      <Navbar recipeFinderRef={recipeFinderRef} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/recipes-finder" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/recipes-finder" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/recipes-finder" /> : <Registration />}
        />
        <Route
          path="/recipes-finder"
          element={isAuthenticated ? <RecipesFinder recipeFinderRef={recipeFinderRef} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
