import React, { useState } from "react";

function App() {
  // State for each endpoint's response
  const [helloResponse, setHelloResponse] = useState("");
  const [timeResponse, setTimeResponse] = useState("");
  const [echoInput, setEchoInput] = useState("");
  const [echoNumber, setEchoNumber] = useState(0);
  const [echoResponse, setEchoResponse] = useState("");
  const [error, setError] = useState("");

  // Base URL for your API
  const API_BASE = "http://localhost:8000/api";

  // Fetch from GET /api/hello
  const fetchHello = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/hello`);
      if (!res.ok) throw new Error("Unable to fetch hello");
      const data = await res.json();
      setHelloResponse(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch from GET /api/time
  const fetchTime = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/time`);
      if (!res.ok) throw new Error("Unable to fetch time");
      const data = await res.json();
      setTimeResponse(data.time);
    } catch (err) {
      setError(err.message);
    }
  };

  // POST to /api/echo with user input
  const postEcho = async () => {
    setError("");
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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>FastAPI & React Example</h1>

      <div style={{ border: "1px solid #ddd", padding: "20px", margin: "20px 0", borderRadius: "8px" }}>
        <h2>GET /api/hello</h2>
        <button onClick={fetchHello} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Fetch Hello
        </button>
        {helloResponse && <p><strong>Response:</strong> {helloResponse}</p>}
      </div>

      <div style={{ border: "1px solid #ddd", padding: "20px", margin: "20px 0", borderRadius: "8px" }}>
        <h2>GET /api/time</h2>
        <button onClick={fetchTime} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Fetch Time
        </button>
        {timeResponse && <p><strong>Current Time:</strong> {timeResponse}</p>}
      </div>

      <div style={{ border: "1px solid #ddd", padding: "20px", margin: "20px 0", borderRadius: "8px" }}>
        <h2>POST /api/echo</h2>
        <input
          type="text"
          value={echoInput}
          onChange={(e) => setEchoInput(e.target.value)}
          placeholder="Enter text to echo"
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <input
          type="number"
          value={echoNumber}
          onChange={(e) => setEchoNumber(e.target.value)}
          placeholder="Enter number to echo"
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <button onClick={postEcho} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Send
        </button>
        {echoResponse && <p><strong>Echo Response:</strong> {echoResponse}</p>}
      </div>

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default App;
