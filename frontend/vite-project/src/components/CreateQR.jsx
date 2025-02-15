import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { HexColorPicker } from 'react-colorful';
import './CreateQR.css';

function CreateQR({ onLogout }) {
  // State management for URL input, QR response, and indicator states
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false); // State for save indicator

  // State for QR code customization
  const [dotStyle, setDotStyle] = useState('square');
  const [fillColor, setFillColor] = useState('#000000');
  const [backColor, setBackColor] = useState('#FFFFFF');
  const [eyeStyle, setEyeStyle] = useState('square');  // State for eye style
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [showBackPicker, setShowBackPicker] = useState(false);

  // Get username from localStorage
  const username = localStorage.getItem("username") || "User";

  // Available dot styles
  const dotStyles = [
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'circle', label: 'Circle' },
    { value: 'gapped', label: 'Gapped Square' }
  ];

  // Available eye styles
  const eyeStyles = [
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'circle', label: 'Circle' },
    { value: 'gapped', label: 'Gapped Square' }
  ];

  // Function to handle QR code generation (does not save to database)
  const handleGenerateQR = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/qr/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          dot_style: dotStyle,
          fill_color: fillColor,
          back_color: backColor,
          eye_style: eyeStyle  // Include eye style in request
        })
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

  // Function to handle saving the QR code to the database; triggered by the "Save QR" button.
  const handleSaveQR = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/qr/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          dot_style: dotStyle,
          fill_color: fillColor,
          back_color: backColor,
          eye_style: eyeStyle
        })
      });
      if (!response.ok) {
        throw new Error('Failed to save QR code');
      }
      const data = await response.json();
      setQrCode(data.qr_code);
      // Set the saveSuccess indicator to true and remove it after 1 second
      setSaveSuccess(true);
      setTimeout(() => {
         setSaveSuccess(false);
      }, 1000);
    } catch (err) {
      setError(err.message === 'Failed to save QR code' 
        ? 'Failed to save QR code. Please try again.' 
        : 'Unexpected error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        username={username}
        onLogout={onLogout}
      />

      <div className="create-qr-container">
        <h2>Create QR Code</h2>
        
        {/* URL input section */}
        <div className="input-section">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL or Text to generate QR code"
            className="url-input"
          />
        </div>

        {/* Customization options */}
        <div className="customization-section">
          <div className="option-group">
            <label>Dot Style:</label>
            <select 
              value={dotStyle}
              onChange={(e) => setDotStyle(e.target.value)}
              className="style-select"
            >
              {dotStyles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label>Eye Style:</label> {/* New dropdown for eye style */}
            <select 
              value={eyeStyle}
              onChange={(e) => setEyeStyle(e.target.value)}
              className="style-select"
            >
              {eyeStyles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label>QR Code Color:</label>
            <div className="color-picker-container">
              <button 
                className="color-preview"
                style={{ backgroundColor: fillColor }}
                onClick={() => setShowFillPicker(!showFillPicker)}
              />
              {showFillPicker && (
                <div className="color-picker-popover">
                  <HexColorPicker 
                    color={fillColor} 
                    onChange={setFillColor}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="option-group">
            <label>Background Color:</label>
            <div className="color-picker-container">
              <button 
                className="color-preview"
                style={{ backgroundColor: backColor }}
                onClick={() => setShowBackPicker(!showBackPicker)}
              />
              {showBackPicker && (
                <div className="color-picker-popover">
                  <HexColorPicker 
                    color={backColor} 
                    onChange={setBackColor}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="button-group">
          <button 
            onClick={handleGenerateQR}
            disabled={isLoading}
            className="generate-button"
          >
            {isLoading ? 'Generating...' : 'Generate QR'}
          </button>
          {/* Save QR button with temporary success indicator */}
          <button 
            onClick={handleSaveQR}
            disabled={isLoading || !qrCode}
            className="save-button"
          >
            {isLoading ? 'Saving...' : 'Save QR'}
          </button>
          {saveSuccess && <span className="save-success">&#10003;</span>}
        </div>

        {error && <div className="error-message">{error}</div>}

        {qrCode && (
          <div className="qr-result">
            <img src={qrCode} alt="Generated QR Code" className="qr-image" />
            <button onClick={handleDownload} className="download-button">
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateQR;