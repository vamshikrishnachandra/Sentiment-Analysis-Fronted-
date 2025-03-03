export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  text: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, any>;
}