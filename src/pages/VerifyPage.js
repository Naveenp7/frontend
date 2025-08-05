import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { verifySelfie } from '../services/api';

const VerifyPage = ({ backendStatus }) => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id');
  
  const [captureMethod, setCaptureMethod] = useState('camera');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selfieImage, setSelfieImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Reset state when event ID changes
  useEffect(() => {
    setSelfieImage(null);
    setVerificationResult(null);
    setError(null);
  }, [eventId]);
  
  // Handle camera errors
  const handleCameraError = (error) => {
    console.error('Camera error:', error);
    setError('Could not access camera. Please allow camera access or use the upload option.');
    setCaptureMethod('upload');
  };
  
  // Handle camera ready state
  const handleCameraReady = () => {
    setIsCameraReady(true);
  };
  
  // Capture image from webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setSelfieImage(imageSrc);
        setError(null);
      } else {
        setError('Failed to capture image. Please try again.');
      }
    }
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfieImage(event.target.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Reset capture
  const resetCapture = () => {
    setSelfieImage(null);
    setVerificationResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Submit selfie for verification
  const submitSelfie = async () => {
    if (!eventId) {
      setError('Event ID is required. Please scan the QR code or enter the event ID.');
      return;
    }
    
    if (!selfieImage) {
      setError('Please capture or upload a selfie first.');
      return;
    }
    
    if (!backendStatus.isOnline) {
      setError('Backend is offline. Please try again when the photographer\'s system is online.');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      // Convert base64 image to blob
      const response = await fetch(selfieImage);
      const blob = await response.blob();
      const contentType = blob.type; // Get content type from the blob
      const filename = `selfie_${Date.now()}.jpeg`; // Create a dummy filename
      
      // Send to API
      const result = await verifySelfie(eventId, blob, filename, contentType);
      setVerificationResult(result);
      
      // If successful, redirect to gallery after a short delay
      if (result.success && result.cluster_id) {
        setTimeout(() => {
          navigate(`/gallery/${eventId}/${result.cluster_id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-user-check me-2"></i>
                Photo Verification
              </h4>
            </Card.Header>
            
            <Card.Body>
              {!backendStatus.isOnline && !backendStatus.checking ? (
                <Alert variant="danger">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  The photographer's system is currently offline. Verification is not available.
                </Alert>
              ) : (
                <>
                  {!eventId && (
                    <Alert variant="warning">
                      <i className="fas fa-info-circle me-2"></i>
                      No event ID provided. Please scan the QR code provided by the photographer or enter the event ID.
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert variant="danger">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}
                  
                  {verificationResult ? (
                    <div className={`verification-result ${verificationResult.success ? 'success' : 'error'}`}>
                      {verificationResult.success ? (
                        <>
                          <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                          <h4>Verification Successful!</h4>
                          <p>We found you in our system. Redirecting to your gallery...</p>
                          <div className="spinner-border text-primary mt-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times-circle fa-3x text-danger mb-3"></i>
                          <h4>Verification Failed</h4>
                          <p>{verificationResult.message || 'We couldn\'t match your selfie with any faces in our system.'}</p>
                          <Button variant="primary" onClick={resetCapture}>
                            Try Again
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      {!selfieImage ? (
                        <>
                          <p className="text-center mb-4">
                            Please take a selfie or upload a photo to find your pictures from the event.
                          </p>
                          
                          <div className="mb-4">
                            <div className="btn-group w-100" role="group">
                              <Button 
                                variant={captureMethod === 'camera' ? 'primary' : 'outline-primary'}
                                onClick={() => setCaptureMethod('camera')}
                              >
                                <i className="fas fa-camera me-2"></i>
                                Use Camera
                              </Button>
                              <Button 
                                variant={captureMethod === 'upload' ? 'primary' : 'outline-primary'}
                                onClick={() => setCaptureMethod('upload')}
                              >
                                <i className="fas fa-upload me-2"></i>
                                Upload Photo
                              </Button>
                            </div>
                          </div>
                          
                          {captureMethod === 'camera' ? (
                            <div className="selfie-container mb-3">
                              <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                  facingMode: 'user',
                                  width: 500,
                                  height: 500
                                }}
                                onUserMedia={handleCameraReady}
                                onUserMediaError={handleCameraError}
                                className="w-100"
                              />
                              <Button 
                                className="capture-btn"
                                onClick={captureImage}
                                disabled={!isCameraReady}
                              >
                                <i className="fas fa-camera"></i>
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center mb-3">
                              <Form.Group controlId="selfieUpload" className="mb-3">
                                <Form.Label className="d-block p-4 border rounded cursor-pointer">
                                  <i className="fas fa-upload fa-3x mb-3 text-primary"></i>
                                  <p>Click to select a photo or drag and drop</p>
                                  <Form.Control 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="d-none"
                                  />
                                </Form.Label>
                              </Form.Group>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-center mb-3">
                            Is this photo clear? We'll use it to find your pictures.
                          </p>
                          
                          <div className="selfie-container mb-4">
                            <img src={selfieImage} alt="Selfie preview" className="w-100" />
                          </div>
                          
                          <div className="d-flex justify-content-between">
                            <Button variant="outline-secondary" onClick={resetCapture}>
                              <i className="fas fa-redo me-2"></i>
                              Retake
                            </Button>
                            
                            <Button 
                              variant="primary" 
                              onClick={submitSelfie}
                              disabled={isVerifying || !backendStatus.isOnline}
                            >
                              {isVerifying ? (
                                <>
                                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check me-2"></i>
                                  Verify & Find My Photos
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Card.Body>
            
            {eventId && (
              <Card.Footer className="text-center text-muted">
                <small>Event ID: {eventId}</small>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyPage;