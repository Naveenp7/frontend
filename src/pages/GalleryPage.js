import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGallery, getEvent } from '../services/api';

const GalleryPage = ({ backendStatus }) => {
  const { eventId, clusterId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [event, setEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Fetch gallery data
  useEffect(() => {
    const fetchData = async () => {
      if (!backendStatus.isOnline) {
        setError('Backend is offline. Please try again when the photographer\'s system is online.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch event details
        const eventData = await getEvent(eventId);
        setEvent(eventData);
        
        // Fetch gallery
        const galleryData = await getGallery(eventId, clusterId);
        setGallery(galleryData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setError(error.message || 'Failed to load gallery. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [eventId, clusterId, backendStatus.isOnline]);
  
  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  // Download single image
  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      setError('Failed to download image. Please try again.');
    }
  };
  
  // Download all images
  const downloadAllImages = async () => {
    if (!gallery || !gallery.images || gallery.images.length === 0) {
      return;
    }
    
    setDownloading(true);
    
    try {
      for (let i = 0; i < gallery.images.length; i++) {
        await downloadImage(gallery.images[i]);
        // Add a small delay to prevent browser from blocking downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error downloading images:', error);
      setError('Failed to download all images. Please try again.');
    } finally {
      setDownloading(false);
    }
  };
  
  // If backend is offline, redirect to home
  useEffect(() => {
    if (!backendStatus.isOnline && !backendStatus.checking && !loading) {
      navigate('/');
    }
  }, [backendStatus.isOnline, backendStatus.checking, loading, navigate]);
  
  return (
    <Container>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your gallery...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      ) : gallery && event ? (
        <>
          <Row className="mb-4">
            <Col md={8}>
              <h2>Your Personal Gallery</h2>
              <p className="text-muted">
                <i className="far fa-calendar-alt me-2"></i>
                {event.name}
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <Link to={`/verify?event_id=${eventId}`} className="btn btn-outline-primary">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Verification
              </Link>
            </Col>
          </Row>
          
          {gallery.images && gallery.images.length > 0 ? (
            <>
              <div className="gallery-container">
                {gallery.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="gallery-item"
                    onClick={() => handleImageClick(image)}
                  >
                    <img src={image} alt={`Gallery photo ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-muted">Found {gallery.images.length} photos featuring you</p>
                <Button 
                  variant="primary" 
                  onClick={downloadAllImages}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download me-2"></i>
                      Download All Photos
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-images fa-4x text-muted mb-3"></i>
              <h4>No Photos Found</h4>
              <p className="text-muted">We couldn't find any photos for you in this event.</p>
              <Link to={`/verify?event_id=${eventId}`} className="btn btn-primary mt-3">
                <i className="fas fa-redo me-2"></i>
                Try Again
              </Link>
            </div>
          )}
          
          {/* Image Modal */}
          <Modal 
            show={showModal} 
            onHide={handleCloseModal} 
            centered 
            size="xl"
            className="photo-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Photo View</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0 text-center">
              {selectedImage && (
                <img src={selectedImage} alt="Full size" className="img-fluid" />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="primary" 
                onClick={() => selectedImage && downloadImage(selectedImage)}
              >
                <i className="fas fa-download me-2"></i>
                Download
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Alert variant="warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No gallery data available. Please verify your identity first.
        </Alert>
      )}
    </Container>
  );
};

export default GalleryPage;