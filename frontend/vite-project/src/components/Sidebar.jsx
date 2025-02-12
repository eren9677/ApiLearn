import React from 'react';
import './Sidebar.css';

// Sidebar component that shows user info and logout button
function Sidebar({ isOpen, onClose, username, onLogout }) {
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
          <button className="sidebar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar; 