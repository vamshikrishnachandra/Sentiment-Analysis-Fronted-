import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const ANALYZE_SENTIMENT_MUTATION = gql`
  mutation AnalyzeSentiment($text: String!) {
    analyzeSentiment(text: $text) {
      sentiment
      score
      text
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser {
    me {
      id
      email
    }
  }
`;