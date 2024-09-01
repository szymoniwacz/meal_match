import { GET_INGREDIENTS } from '../../graphql/queries/getIngredients';
import { FIND_RECIPES } from '../../graphql/mutations/findRecipes';

export const mocks = [
  {
    request: {
      query: GET_INGREDIENTS,
    },
    result: {
      data: {
        ingredients: [
          { id: '1', name: 'Tomato' },
          { id: '2', name: 'Basil' },
          { id: '3', name: 'Garlic' },
        ],
      },
    },
  },
  {
    request: {
      query: FIND_RECIPES,
      variables: {
        input: { ingredientIds: ['1', '2'] },
      },
    },
    result: {
      data: {
        findRecipes: {
          recipes: [
            {
              id: '1',
              title: 'Tomato Basil Pasta',
              ingredientIds: ['1', '2'],
              cookTime: '30 min',
              prepTime: '10 min',
              ratings: 4.5,
              cuisine: 'Italian',
              category: 'Main Course',
              author: 'Chef John',
              image: 'pasta.jpg',
              matchingIngredientsCount: 2,
            },
          ],
        },
      },
    },
  },
];
