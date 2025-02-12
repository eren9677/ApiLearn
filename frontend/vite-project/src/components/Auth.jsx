import React, { useState } from "react";
// Import the separate CSS file for Auth component
import './Auth.css';

function Auth({ onLoginSuccess }) {
  // State management for form inputs and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSignup, setIsSignup] = useState(false);  // Toggle between login and signup forms
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:8000/api";

  // Handle form submission for both login and signup
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    
    // Determine which endpoint to use based on form type
    const endpoint = isSignup ? "signup" : "login";
    try {
      // Prepare request body based on form type
      const body = isSignup 
        ? JSON.stringify({ username, email, password })
        : new URLSearchParams({ username, password });

      // Set appropriate content type for the request
      const headers = isSignup 
        ? { "Content-Type": "application/json" }
        : { "Content-Type": "application/x-www-form-urlencoded" };

      // Make API request
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers,
        body: isSignup ? body : body.toString()
      });

      const data = await res.json();
      
      // Handle API errors
      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed");
      }
      
      // Store token and update app state on success
      localStorage.setItem("token", data.access_token);
      onLoginSuccess();
      
      // Clear form fields
      setUsername("");
      setPassword("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Main container for the auth form
    <div className="auth-container">
      {/* Form title that changes based on mode */}
      <h2 className="auth-title">
        {isSignup ? "Create Account" : "Welcome Back"}
      </h2>

      {/* Authentication form */}
      <form onSubmit={handleAuth} className="auth-form">
        {/* Username input */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="auth-input"
        />

        {/* Email input - only shown for signup */}
        {isSignup && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="auth-input"
          />
        )}

        {/* Password input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
        />

        {/* Submit button */}
        <button type="submit" className="auth-submit">
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      {/* Toggle between login and signup */}
      <button 
        onClick={() => setIsSignup(!isSignup)} 
        className="auth-toggle"
      >
        {isSignup ? "Already have an account? Login" : "Need an account? Sign Up"}
      </button>

      {/* Error message display */}
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default Auth; 