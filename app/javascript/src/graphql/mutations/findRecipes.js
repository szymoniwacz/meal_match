import { gql } from '@apollo/client';

export const FIND_RECIPES = gql`
  mutation FindRecipes($input: FindRecipesInput!) {
    findRecipes(input: $input) {
      recipes {
        id
        title
        ingredientIds
        ingredientNames
        cookTime
        prepTime
        ratings
        cuisine
        category
        author
        image
        matchingIngredientsCount
        language
      }
    }
  }
`;
