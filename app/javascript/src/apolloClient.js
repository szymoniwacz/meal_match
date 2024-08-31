import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  cache: new InMemoryCache(),
});

export default client;
