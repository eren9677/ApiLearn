import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './CreateQR.css';

function CreateQR() {
  // State management for URL input and QR code response
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Get username from localStorage
  const username = localStorage.getItem("username") || "User";

  // Function to handle QR code generation
  const handleGenerateQR = async () => {
    // Reset states
    setError('');
    setIsLoading(true);

    try {
      // Make API call to backend
      const response = await fetch('http://localhost:8000/api/qr/create?url=' + encodeURIComponent(url), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrCode(data.qr_code);
    } catch (err) {
      setError(err.message === 'Failed to generate QR code' 
        ? 'Failed to generate QR code. Please try again.' 
        : 'Please enter a valid URL');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle QR code download
  const handleDownload = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        username={username}
      />

      <div className="create-qr-container">
        <h2>Create QR Code</h2>
        
        {/* URL input section */}
        <div className="input-section">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to generate QR code"
            className="url-input"
          />
          <button 
            onClick={handleGenerateQR}
            disabled={isLoading}
            className="generate-button"
          >
            {isLoading ? 'Generating...' : 'Generate QR'}
          </button>
        </div>

        {/* Error display */}
        {error && <div className="error-message">{error}</div>}

        {/* QR code display section */}
        {qrCode && (
          <div className="qr-result">
            <img src={qrCode} alt="Generated QR Code" className="qr-image" />
            <div className="qr-actions">
              <button onClick={handleDownload} className="download-button">
                Download QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateQR; 