import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;