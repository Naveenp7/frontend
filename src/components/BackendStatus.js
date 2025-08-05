import React from 'react';
import { Alert } from 'react-bootstrap';

const BackendStatus = ({ isOnline, checking, tunnelUrl }) => {
  // Don't show anything if the backend is online
  if (isOnline) {
    return null;
  }
  
  return (
    <Alert 
      variant={checking ? 'warning' : 'danger'}
      className="d-flex align-items-center justify-content-between mb-4"
    >
      <div>
        <span 
          className={`status-indicator ${checking ? 'checking' : 'offline'}`}
        ></span>
        
        {checking ? (
          <span>Checking backend connection...</span>
        ) : (
          <span>
            <strong>Backend Unavailable</strong> - The photographer's system is currently offline.
          </span>
        )}
      </div>
      
      {!checking && (
        <div>
          <small className="text-muted">
            Please try again later or contact the event photographer.
          </small>
        </div>
      )}
    </Alert>
  );
};

export default BackendStatus;