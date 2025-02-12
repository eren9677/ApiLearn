import React, { useState } from "react";
// Import the separate CSS file for Dashboard component
import './Dashboard.css';

function Dashboard({ onLogout }) {
  // State management for API responses and user inputs
  const [helloResponse, setHelloResponse] = useState("");
  const [timeResponse, setTimeResponse] = useState("");
  const [echoInput, setEchoInput] = useState("");
  const [echoNumber, setEchoNumber] = useState(0);
  const [echoResponse, setEchoResponse] = useState("");
  const [error, setError] = useState("");

  // API endpoint configuration
  const API_BASE = "http://localhost:8000/api";

  // Handler for the /hello endpoint
  const fetchHello = async () => {
    setError(""); // Clear any previous errors
    try {
      const res = await fetch(`${API_BASE}/hello`);
      if (!res.ok) throw new Error("Unable to fetch hello");
      const data = await res.json();
      setHelloResponse(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler for the /time endpoint
  const fetchTime = async () => {
    setError(""); // Clear any previous errors
    try {
      const res = await fetch(`${API_BASE}/time`);
      if (!res.ok) throw new Error("Unable to fetch time");
      const data = await res.json();
      setTimeResponse(data.time);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler for the /echo endpoint
  const postEcho = async () => {
    setError(""); // Clear any previous errors
    try {
      const res = await fetch(`${API_BASE}/echo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: echoInput, number: echoNumber})
      });
      if (!res.ok) throw new Error("Unable to post echo");
      const data = await res.json();
      setEchoResponse(`${data.message} (${data.number})`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Main dashboard container
    <div className="dashboard-container">
      {/* Header with Logout Button */}
      <div className="dashboard-header">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Hello API Section */}
      <div className="api-section">
        <h2 className="section-title">GET /api/hello</h2>
        <button onClick={fetchHello} className="api-button">
          Fetch Hello
        </button>
        {/* Display hello response if available */}
        {helloResponse && (
          <div className="api-response">
            <strong>Response:</strong> {helloResponse}
          </div>
        )}
      </div>

      {/* Time API Section */}
      <div className="api-section">
        <h2 className="section-title">GET /api/time</h2>
        <button onClick={fetchTime} className="api-button">
          Fetch Time
        </button>
        {/* Display time response if available */}
        {timeResponse && (
          <div className="api-response">
            <strong>Current Time:</strong> {timeResponse}
          </div>
        )}
      </div>

      {/* Echo API Section */}
      <div className="api-section">
        <h2 className="section-title">POST /api/echo</h2>
        <div style={{ marginBottom: "15px" }}>
          {/* Text input for echo */}
          <input
            type="text"
            value={echoInput}
            onChange={(e) => setEchoInput(e.target.value)}
            placeholder="Enter text to echo"
            className="api-input"
          />
          {/* Number input for echo */}
          <input
            type="number"
            value={echoNumber}
            onChange={(e) => setEchoNumber(e.target.value)}
            placeholder="Enter number"
            className="api-input"
          />
          <button onClick={postEcho} className="api-button">
            Send
          </button>
        </div>
        {/* Display echo response if available */}
        {echoResponse && (
          <div className="api-response">
            <strong>Echo Response:</strong> {echoResponse}
          </div>
        )}
      </div>

      {/* Error Display Section */}
      {error && (
        <div className="api-error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default Dashboard; 