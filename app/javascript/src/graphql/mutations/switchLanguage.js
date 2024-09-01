import { gql } from '@apollo/client';

export const SWITCH_LANGUAGE = gql`
  mutation SwitchLanguage($input: String!) {
    switchLanguage(input: $input) {
      success
    }
  }
`;
