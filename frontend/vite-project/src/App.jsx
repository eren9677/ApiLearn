import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import CreateQR from "./components/CreateQR";
import ManageQR from "./components/ManageQR";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // Reset to home page on logout
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  // Render auth page if not logged in
  if (!isLoggedIn) {
    return <Auth onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Render appropriate component based on current path
  const renderContent = () => {
    switch (currentPath) {
      case '/create-qr':
        return <CreateQR onLogout={handleLogout} />;
      case '/manage-qr':
        return <ManageQR onLogout={handleLogout} />;
      default:
        return <Dashboard onLogout={handleLogout} />;
    }
  };

  return (
    <div className="app-container">
      {renderContent()}
    </div>
  );
}

export default App;
