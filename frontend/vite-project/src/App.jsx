import React, { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">FastAPI & React Example</h1>

      {!isLoggedIn ? (
        <Auth onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
