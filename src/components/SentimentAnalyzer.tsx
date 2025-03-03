import React, { useState } from 'react';
import { AlertTriangle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/graphql/'; // 🔹 Replace with actual API URL

const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ sentiment: string; score: number; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AnalyzeText($text: String!) {
              analyzeText(text: $text) {  
                label
                score
              }
            }
          `,
          variables: { text },
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const { data } = await response.json();
      if (!data.analyzeText) {
        throw new Error('No response from API');
      }

      setResult({
        sentiment: data.analyzeText.label.toLowerCase(),
        score: data.analyzeText.score,
        text,
      });
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };



  const getSentimentIcon = () => {
    if (!result) return null;
    switch (result.sentiment) {
      case 'positive':
        return <ThumbsUp className="w-12 h-12 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="w-12 h-12 text-red-500" />;
      case 'neutral':
        return <Minus className="w-12 h-12 text-gray-500" />;
      default:
        return null;
    }
  };

  const getSentimentColor = () => {
    if (!result) return 'bg-gray-200';
    switch (result.sentiment) {
      case 'positive':
        return 'bg-green-100 border-green-300';
      case 'negative':
        return 'bg-red-100 border-red-300';
      case 'neutral':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Sentiment Analysis</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to analyze (max 500 characters)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={5}
            maxLength={500}
            placeholder="Type or paste text here..."
          />
          <div className="text-sm text-gray-500 mt-1">{text.length}/500 characters</div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>

      {result && (
        <div className={`p-6 border rounded-md ${getSentimentColor()}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Analysis Result</h3>
            {getSentimentIcon()}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-1">Sentiment:</p>
            <p className="text-lg font-semibold capitalize">{result.sentiment}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-1">Confidence Score:</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${result.sentiment === 'positive'
                  ? 'bg-green-500'
                  : result.sentiment === 'negative'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                  }`}
                style={{ width: `${Math.abs(result.score * 100)}%` }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1">{Math.abs(result.score * 100).toFixed(1)}%</p>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-1">Analyzed Text:</p>
            <p className="text-sm italic bg-white p-3 rounded border border-gray-200">"{result.text}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalyzer;
