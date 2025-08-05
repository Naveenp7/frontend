import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="mb-3">
              <i className="fas fa-camera-retro me-2"></i>
              FaceSnap Gallery
            </h5>
            <p className="text-muted">
              A hybrid full-stack web application for event photographers to share photos with guests using face recognition.
            </p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-home me-2"></i>Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/verify" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-user-check me-2"></i>Verify
                </a>
              </li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6 className="mb-3">Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-envelope me-2 text-white-50"></i>
                <a href="mailto:info@facesnap.example.com" className="text-decoration-none text-white-50 hover-white">
                  info@facesnap.example.com
                </a>
              </li>
              <li className="mb-2">
                <i className="fas fa-globe me-2 text-white-50"></i>
                <a href="https://facesnap.example.com" className="text-decoration-none text-white-50 hover-white">
                  facesnap.example.com
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row>
          <Col className="text-center text-white-50">
            <small>&copy; {currentYear} FaceSnap Gallery. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;