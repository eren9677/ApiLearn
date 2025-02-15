import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './ManageQR.css';
import { FaDownload, FaTrash } from 'react-icons/fa';

function ManageQR({ onLogout }) {
  // State management for sidebar and QR codes
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Get username from localStorage
  const username = localStorage.getItem("username") || "User";

  // Fetch user's QR codes on component mount
  const fetchQRCodes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/qr', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch QR codes');
      const data = await response.json();
      setQrCodes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async (qrId) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/qr/${qrId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete QR code');
      }

      // Refresh the QR codes list
      fetchQRCodes();
    } catch (err) {
      setError(err.message);
    }
  };

  // Updated handleDownload function to ensure proper data URI is used for the QR code image
  const handleDownload = (qrCode, url) => {
    // Check if the qrCode string already contains the data URI prefix
    // If not, prepend it.
    const dataUri = qrCode.startsWith('data:') 
      ? qrCode 
      : `data:image/png;base64,${qrCode}`;
    
    // Create a temporary link element for triggering the download
    const link = document.createElement('a');
    link.href = dataUri;
    // Encode url to safely use it in the file name, and set file extension to .png
    link.download = `qr-code-${encodeURIComponent(url)}.png`;
    
    // Append the link, trigger click, and then remove the link from the document
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        onLogout={onLogout}
      />

      <div className="manage-qr-container">
        <h2>Manage Your QR Codes</h2>

        {/* Error display */}
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="qr-codes-list">
            {qrCodes.length > 0 ? (
              qrCodes.map(qr => (
                <div key={qr.id} className="qr-code-item">
                  <img src={`data:image/png;base64,${qr.qr_image}`} alt={`QR Code for ${qr.url}`} className="qr-image" />
                  <div className="qr-info">
                    <p className="qr-url">Link: <a href={qr.url} target="_blank" rel="noopener noreferrer">{qr.url}</a></p>
                    <p className="qr-date">Created: {formatDate(qr.created_at)}</p>
                    <div className="button-group">
                      <button 
                        onClick={() => handleDownload(qr.qr_image, qr.url)}
                        className="action-button download-button"
                        title="Download QR Code"
                      >
                        <FaDownload /> Download
                      </button>
                      <button 
                        onClick={() => handleDelete(qr.id)}
                        className="action-button delete-button"
                        title="Delete QR Code"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No QR codes generated yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageQR;