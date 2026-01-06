import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap/';
import { Navigate } from 'react-router-dom';

function Header({ loggedIn, onLogout }) {
    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    return (
        <Navbar className="custom-navbar">
  <Container>
    <Navbar.Brand href="/" className="text-light">Indovina il numero!</Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      {loggedIn ? (
        <Button variant="outline-light" onClick={onLogout} className="custom-button">
          Logout
        </Button>
      ) : (
        <Button variant="outline-light" onClick={handleLoginClick} className="custom-button">
          Login
        </Button>
      )}
    </Navbar.Collapse>
  </Container>
</Navbar>

    );
}

export default Header;
