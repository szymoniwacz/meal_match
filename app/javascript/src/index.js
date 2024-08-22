import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import App from './App';
import { AuthProvider } from './context/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}
