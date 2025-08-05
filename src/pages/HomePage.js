import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <h1>Welcome to FaceSnap Gallery</h1>
        <p className="lead">
          Find your photos from events using our advanced face recognition technology.
          Simply verify with a selfie and access your personalized gallery.
        </p>
        <Link to="/verify" className="btn btn-primary btn-lg">
          <i className="fas fa-user-check me-2"></i>
          Verify & Find Your Photos
        </Link>
      </section>
      
      {/* Features Section */}
      <section className="my-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="feature-card h-100">
              <Card.Body className="text-center p-4">
                <div className="feature-icon">
                  <i className="fas fa-camera"></i>
                </div>
                <Card.Title>1. Photographer Uploads Photos</Card.Title>
                <Card.Text>
                  The event photographer uploads photos to their local system and our
                  AI automatically detects and groups faces.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="feature-card h-100">
              <Card.Body className="text-center p-4">
                <div className="feature-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <Card.Title>2. Verify with a Selfie</Card.Title>
                <Card.Text>
                  Scan the event QR code or visit the verification page. Take a selfie
                  or upload a photo of yourself to verify your identity.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="feature-card h-100">
              <Card.Body className="text-center p-4">
                <div className="feature-icon">
                  <i className="fas fa-images"></i>
                </div>
                <Card.Title>3. Access Your Gallery</Card.Title>
                <Card.Text>
                  After successful verification, you'll get instant access to all photos
                  featuring you from the event. Download and share your memories!
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      
      {/* CTA Section */}
      <section className="text-center py-5 my-5 bg-light rounded">
        <h2>Ready to find your photos?</h2>
        <p className="lead mb-4">
          Use the QR code provided by the event photographer or verify directly on this site.
        </p>
        <Link to="/verify" className="btn btn-primary btn-lg">
          <i className="fas fa-search me-2"></i>
          Find My Photos
        </Link>
      </section>
    </Container>
  );
};

export default HomePage;