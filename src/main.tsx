import React from 'react';
import ReactDOM from 'react-dom/client';  // ✅ Use React 18's createRoot
import App from './App.tsx';
import './index.css';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client.ts';

// Import mock service worker for development
if (import.meta.env.DEV) {
  import('./mock-server/server.js')
    .then(({ worker }) => {
      worker.start();
      console.log('Mock server started');
    })
    .catch(err => console.error('Failed to start mock server:', err));
}

// ✅ Correct React 18 way: Use `ReactDOM.createRoot`
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
