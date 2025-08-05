import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Link to="/" className="navbar-brand">
          <i className="fas fa-camera-retro me-2"></i>
          Face<span>Snap</span> Gallery
        </Link>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink to="/" className={({isActive}) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              <i className="fas fa-home me-1"></i> Home
            </NavLink>
            
            <NavLink to="/verify" className={({isActive}) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              <i className="fas fa-user-check me-1"></i> Verify
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;