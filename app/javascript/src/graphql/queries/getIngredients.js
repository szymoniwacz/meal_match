import { gql } from '@apollo/client';

export const GET_INGREDIENTS = gql`
  query GetIngredients($language: String!) {
    ingredients(language: $language) {
      id
      name
      language
    }
  }
`;
