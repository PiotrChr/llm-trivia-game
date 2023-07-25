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
              <Nav.Link href="/score" active={location.pathname === "/score"}>Score</Nav.Link>
              <Nav.Link href="/stats" active={location.pathname === "/stats"}>Stats</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {user ? (
                <>
                  <Dropdown className="me-5">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <i className="bi-joystick me-2"></i> Play
                    </Dropdown.Toggle>
              
                    <Dropdown.Menu>
                      <Dropdown.Item href="/game/list">
                        <i className="bi-person-fill-add me-2"></i> List
                      </Dropdown.Item>
                      <Dropdown.Item href="/game/join">
                        <i className="bi-person-fill-add me-2"></i> Join
                      </Dropdown.Item>
                      <Dropdown.Item href="/game/host">
                        <i className="bi-file-plus-fill me-2"></i> Host
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      <i className="bi-person-circle me-2"></i> { user }
                    </Dropdown.Toggle>
              
                    <Dropdown.Menu>
                      <Dropdown.Item href="/logout">
                        <i className="bi-door-closed me-2"></i> Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
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