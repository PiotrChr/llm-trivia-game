import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
// Assuming you have UserContext
import { UserContext } from '../../UserContext';

const Layout = ({ children }) => {
  const location = useLocation();
  // You can replace this with whatever you use to handle global state
  const { user, onLogout } = useContext(UserContext);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">LLM Trivia Game</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/" active={location.pathname === "/"}>Home</Nav.Link>
              <Nav.Link href="/game" active={location.pathname === "/game"}>Game</Nav.Link>
              <Nav.Link href="/score" active={location.pathname === "/score"}>Score</Nav.Link>
              <Nav.Link href="/stats" active={location.pathname === "/stats"}>Stats</Nav.Link>
            </Nav>
            {user ? (
              <NavDropdown title={user.username} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
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