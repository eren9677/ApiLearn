import React from 'react';
import './Sidebar.css';

// Sidebar component that shows user info and logout button
function Sidebar({ isOpen, onClose, username, onLogout }) {
  // Function to handle navigation without page refresh
  const handleNavigation = (path) => {
    // Prevent default navigation behavior
    window.history.pushState({}, '', path);
    // Dispatch a navigation event so the App component can handle the route change
    window.dispatchEvent(new PopStateEvent('popstate'));
    // Close the sidebar after navigation
    onClose();
  };

  return (
    <>
      {/* Overlay that appears behind the sidebar */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      
      {/* Main sidebar container */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Close button */}
        <button className="sidebar-close" onClick={onClose}>
          &times;
        </button>

        {/* User profile section */}
        <div className="sidebar-profile">
          {/* User avatar - using first letter of username */}
          <div className="sidebar-avatar">
            {username ? username[0].toUpperCase() : 'U'}
          </div>
          {/* Username display */}
          <h3 className="sidebar-username">{username}</h3>
        </div>

        {/* Sidebar navigation/actions */}
        <div className="sidebar-actions">
          {/* QR Code Management Section */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">QR Code Management</h4>
            <button 
              className="sidebar-button" 
              onClick={() => handleNavigation('/create-qr')}
            >
              Create QR
            </button>
            <button 
              className="sidebar-button" 
              onClick={() => handleNavigation('/manage-qr')}
            >
              Manage QRs
            </button>
          </div>
          
          {/* Logout button */}
          <button className="sidebar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar; 