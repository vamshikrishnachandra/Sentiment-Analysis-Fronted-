import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SentimentAnalyzer from '../components/SentimentAnalyzer';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {user && (
            <p className="mt-2 text-sm text-gray-600">
              Welcome back, {user.email}
            </p>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <SentimentAnalyzer />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;