import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle } from "lucide-react";

interface LoginProps {
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Assuming your AuthContext handles token storage

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens in localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Call login function from AuthContext
        login(data.access);

        // Call onSuccess callback if provided
        if (onSuccess) onSuccess();
      } else {
        setError(data.detail || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
