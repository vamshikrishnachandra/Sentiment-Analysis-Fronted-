// This is a mock server implementation for development purposes
// In a real environment, this would be replaced with a FastAPI backend

import { setupWorker, rest, graphql } from 'msw';

// Mock user database
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123'
  }
];

// Mock JWT token generation
const generateToken = (user) => {
  // In a real app, this would use a JWT library
  return `mock-jwt-token-${user.id}`;
};

// Simple sentiment analysis function
const analyzeSentiment = (text) => {
  // This is a very simplified version of sentiment analysis
  // In a real app, this would use a machine learning model
  
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'best', 'amazing', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'hate', 'worst', 'horrible', 'disappointing'];
  
  const words = text.toLowerCase().split(/\W+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) {
    const score = positiveCount / (positiveCount + negativeCount + 0.1);
    return { sentiment: 'positive', score };
  } else if (negativeCount > positiveCount) {
    const score = negativeCount / (positiveCount + negativeCount + 0.1);
    return { sentiment: 'negative', score: -score };
  } else {
    return { sentiment: 'neutral', score: 0 };
  }
};

// GraphQL handlers
const handlers = [
  // Login mutation
  graphql.mutation('Login', (req, res, ctx) => {
    const { email, password } = req.variables;
    
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res(
        ctx.errors([
          {
            message: 'Invalid email or password',
            locations: [{ line: 2, column: 3 }],
            path: ['login']
          }
        ])
      );
    }
    
    const token = generateToken(user);
    
    return res(
      ctx.data({
        login: {
          token,
          user: {
            id: user.id,
            email: user.email
          }
        }
      })
    );
  }),
  
  // Register mutation
  graphql.mutation('Register', (req, res, ctx) => {
    const { email, password } = req.variables;
    
    if (users.some(u => u.email === email)) {
      return res(
        ctx.errors([
          {
            message: 'Email already in use',
            locations: [{ line: 2, column: 3 }],
            path: ['register']
          }
        ])
      );
    }
    
    const newUser = {
      id: String(users.length + 1),
      email,
      password
    };
    
    users.push(newUser);
    
    const token = generateToken(newUser);
    
    return res(
      ctx.data({
        register: {
          token,
          user: {
            id: newUser.id,
            email: newUser.email
          }
        }
      })
    );
  }),
  
  // Analyze sentiment mutation
  graphql.mutation('AnalyzeSentiment', (req, res, ctx) => {
    const { text } = req.variables;
    
    if (!text || text.trim() === '') {
      return res(
        ctx.errors([
          {
            message: 'Text cannot be empty',
            locations: [{ line: 2, column: 3 }],
            path: ['analyzeSentiment']
          }
        ])
      );
    }
    
    if (text.length > 500) {
      return res(
        ctx.errors([
          {
            message: 'Text must be 500 characters or less',
            locations: [{ line: 2, column: 3 }],
            path: ['analyzeSentiment']
          }
        ])
      );
    }
    
    // Add a small delay to simulate network latency
    return res(
      ctx.delay(500),
      ctx.data({
        analyzeSentiment: {
          ...analyzeSentiment(text),
          text
        }
      })
    );
  }),
  
  // Get user query
  graphql.query('GetUser', (req, res, ctx) => {
    // In a real app, this would verify the JWT token
    // For this mock, we'll just return the first user
    
    return res(
      ctx.data({
        me: {
          id: users[0].id,
          email: users[0].email
        }
      })
    );
  })
];

// Start the mock service worker
export const worker = setupWorker(...handlers);
worker.start();

console.log('Mock GraphQL server started');