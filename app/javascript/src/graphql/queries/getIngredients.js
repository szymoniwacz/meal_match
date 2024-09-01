import { gql } from '@apollo/client';

export const GET_INGREDIENTS = gql`
  query GetIngredients {
    ingredients {
      id
      name
    }
  }
`;
