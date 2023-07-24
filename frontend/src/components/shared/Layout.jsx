import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
// Assuming you have UserContext
import { useAuth } from '../../routing/AuthProvider';

const Layout = ({ children }) => {
  const location = useLocation();

  const { user } = useAuth();
  
  const onLogout = () => {
    {/* Add logout functionality here */}
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">LLM Trivia Game</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" active={location.pathname === "/"}>Home</Nav.Link>
              <Nav.Link href="/game" active={location.pathname === "/game/welcome"}>Game</Nav.Link>
              <Nav.Link href="/score" active={location.pathname === "/score"}>Score</Nav.Link>
              <Nav.Link href="/stats" active={location.pathname === "/stats"}>Stats</Nav.Link>
            </Nav>
            <Nav className="mw-auto">
              {user ? (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <i className="bi-alarm"></i> { user }
                  </Dropdown.Toggle>
            
                  <Dropdown.Menu>
                    <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>
        <Container>
          {children}
        </Container>
      </main>
      <footer>
        {/* Footer items go here */}
      </footer>
    </div>
  );
};

export default Layout;