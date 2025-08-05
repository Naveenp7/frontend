import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import BackendStatus from './components/BackendStatus';

// Pages
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import GalleryPage from './pages/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';

// API Service
import { checkBackendStatus } from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState({
    isOnline: false,
    tunnelUrl: null,
    checking: true
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkBackendStatus();
        setBackendStatus({
          isOnline: status.isOnline,
          tunnelUrl: status.tunnelUrl,
          checking: false
        });
      } catch (error) {
        setBackendStatus({
          isOnline: false,
          tunnelUrl: null,
          checking: false
        });
      }
    };

    // Check status immediately
    checkStatus();

    // Then check every 30 seconds
    const intervalId = setInterval(checkStatus, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      
      <main className="flex-grow-1">
        <div className="container py-4">
          <BackendStatus 
            isOnline={backendStatus.isOnline} 
            checking={backendStatus.checking} 
            tunnelUrl={backendStatus.tunnelUrl} 
          />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify" element={<VerifyPage backendStatus={backendStatus} />} />
            <Route 
              path="/gallery/:eventId/:clusterId" 
              element={
                backendStatus.isOnline ? 
                <GalleryPage backendStatus={backendStatus} /> : 
                <Navigate to="/" replace />
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;