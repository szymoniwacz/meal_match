import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Get the CSRF token from the meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Create an HTTP link
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql", // Replace with your GraphQL server URL
});

// Set the CSRF token in the headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-CSRF-Token": csrfToken,
    },
  };
});

// Combine the links
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
