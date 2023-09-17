import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../../routing/AuthProvider';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <>
      <Container className="position-sticky z-index-sticky top-0">
        <Row>
          <Col size={12}>
            <Navbar
              variant="none"
              expand="lg"
              className="blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4 px-2"
            >
              <Container fluid className="pe-0">
                <Navbar.Brand
                  href="/"
                  className="font-weight-bolder ms-lg-0 ms-3"
                >
                  LLM Trivia Game
                </Navbar.Brand>
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="shadow-none ms-2"
                />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mx-auto">
                    <Nav.Link
                      href="/"
                      active={location.pathname === '/'}
                      className="align-items-center me-2"
                    >
                      Home
                    </Nav.Link>
                    <Nav.Link
                      href="/leaderboard"
                      active={location.pathname === '/leaderboard'}
                      className="align-items-center me-2"
                    >
                      Leaderboard
                    </Nav.Link>
                    <Nav.Link
                      href="/score"
                      active={location.pathname === '/about_game'}
                      className="align-items-center me-2"
                    >
                      About game & rules
                    </Nav.Link>
                  </Nav>
                  <Nav>
                    {user ? (
                      <>
                        <Nav.Item
                          className=""
                          onClick={() => navigate('/notifications')}
                        >
                          <Button
                            className="btn-sm btn-icon-only mb-0 mt-1 me-2 btn-round"
                            variant="primary"
                          >
                            <FontAwesomeIcon icon={faBell} />
                          </Button>
                        </Nav.Item>

                        <Dropdown className="me-5">
                          <Dropdown.Toggle
                            variant="none"
                            id="dropdown-basic"
                            className="btn-round btn-sm mb-0 btn-outline-primary me-2"
                          >
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
                          <Dropdown.Toggle
                            variant="none"
                            id="dropdown-basic"
                            className="btn-sm btn-round mb-0 me-1 bg-gradient-dark"
                          >
                            <i className="bi-person-circle me-2"></i>{' '}
                            {user.name}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate('/profile')}>
                              <i className="bi-person-fill me-2"></i> Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/friends')}>
                              <i className="bi-person-fill me-2"></i> Friends
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/logout')}>
                              <i className="bi-door-closed me-2"></i> Logout
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    ) : (
                      <>
                        <Nav.Item className="d-flex align-items-center">
                          <a
                            href="/login"
                            className="btn btn-round btn-sm mb-0 btn-outline-primary me-2"
                          >
                            Login
                          </a>
                        </Nav.Item>
                        <Nav.Item className="d-flex align-items-center">
                          <a
                            href="/signup"
                            className="btn btn-sm btn-round mb-0 me-1 bg-gradient-dark"
                          >
                            Signup
                          </a>
                        </Nav.Item>
                      </>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Col>
        </Row>
      </Container>

      <main className="main-content mt-0">{children}</main>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-4 mx-auto text-center">
              <a
                onClick={() => {
                  navigate('/about_game');
                }}
                target="_blank"
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                About Game
              </a>
              <a
                onClick={() => {
                  navigate('/about_author');
                }}
                target="_blank"
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                About Author
              </a>
              <a
                onClick={() => {
                  navigate('/project_page');
                }}
                target="_blank"
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                Project Page
              </a>
            </div>
            <div className="col-lg-8 mx-auto text-center mb-4 mt-2">
              <a
                onClick={() => {}}
                target="_blank"
                className="text-secondary me-xl-4 me-4"
              >
                <span className="text-lg fab fa-twitter"></span>
              </a>
              <a
                onClick={() => {}}
                target="_blank"
                className="text-secondary me-xl-4 me-4"
              >
                <span className="text-lg fab fa-instagram"></span>
              </a>
              <a
                onClick={() => {}}
                target="_blank"
                className="text-secondary me-xl-4 me-4"
              >
                <span className="text-lg fab fa-github"></span>
              </a>
            </div>
          </div>
          {/* <div className="row">
          <div className="col-8 mx-auto text-center mt-1">
            <p className="mb-0 text-secondary">
              Copyright © <script>
                document.write(new Date().getFullYear())
              </script> Piotr Chrusciel.
            </p>
          </div>
        </div> */}
        </div>
      </footer>
    </>
  );
};

export default Layout;
