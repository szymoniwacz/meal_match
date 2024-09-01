import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!, $rememberMe: Boolean) {
    loginUser(email: $email, password: $password, rememberMe: $rememberMe) {
      user {
        id
        email
      }
      token
      errors
    }
  }
`;
