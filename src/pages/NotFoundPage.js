import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <div className="not-found">
            <i className="fas fa-exclamation-circle"></i>
            <h2>404 - Page Not Found</h2>
            <p className="lead mb-4">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home me-2"></i>
              Return to Home
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;