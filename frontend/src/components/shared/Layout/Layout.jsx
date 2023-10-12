import React from 'react';
import { Col, Container, Dropdown, Nav, Navbar, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../routing/AuthProvider';

import NotificationDropdown from '../../Layout/NotificationsDropdown';
import LanguageDropdown from '../Translation/LanguageDropdown';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
                  className="shadow-none ms-2 border-0"
                >
                  <i className="bi-list"></i>{' '}
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mx-auto">
                    <Nav.Link
                      href="/"
                      active={location.pathname === '/'}
                      className="align-items-center me-2"
                    >
                      {t('navigation.main.home')}
                    </Nav.Link>
                    <Nav.Link
                      href="/leaderboard"
                      active={location.pathname === '/leaderboard'}
                      className="align-items-center me-2"
                    >
                      {t('navigation.main.leaderboard')}
                    </Nav.Link>
                    <Nav.Link
                      href="/score"
                      active={location.pathname === '/about_game'}
                      className="align-items-center me-2"
                    >
                      {t('navigation.main.about_game')}
                    </Nav.Link>
                    <Nav.Link
                      href="/score"
                      active={location.pathname === '/submit_question'}
                      className="align-items-center me-2"
                    >
                      {t('navigation.main.submit_question')}
                    </Nav.Link>
                  </Nav>
                  <Nav>
                    {user ? (
                      <>
                        <NotificationDropdown
                          user={user}
                          // onClick={() => navigate('/notifications')}
                        />

                        <Dropdown className="me-1">
                          <Dropdown.Toggle
                            variant="none"
                            id="dropdown-basic"
                            className="btn-round btn-sm mb-0 btn-outline-primary me-2"
                          >
                            <i className="bi-joystick me-2"></i>{' '}
                            {t('navigation.play.play')}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item href="/game/list">
                              <i className="bi-list-ul me-2"></i>{' '}
                              {t('navigation.play.list')}
                            </Dropdown.Item>
                            <Dropdown.Item href="/game/join">
                              <i className="bi-person-fill-add me-2"></i>{' '}
                              {t('navigation.play.join')}
                            </Dropdown.Item>
                            <Dropdown.Item href="/game/host">
                              <i className="bi-file-plus-fill me-2"></i>{' '}
                              {t('navigation.play.host')}
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
                              <i className="bi-person-fill me-2"></i>{' '}
                              {t('navigation.user.profile')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/friends')}>
                              <i className="bi-people-fill me-2"></i>{' '}
                              {t('navigation.user.friends')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/logout')}>
                              <i className="bi-door-closed me-2"></i>{' '}
                              {t('navigation.user.logout')}
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
                            {t('navigation.user.login')}
                          </a>
                        </Nav.Item>
                        <Nav.Item className="d-flex align-items-center">
                          <a
                            href="/signup"
                            className="btn btn-sm btn-round mb-0 me-1 bg-gradient-dark"
                          >
                            {t('navigation.user.signup')}
                          </a>
                        </Nav.Item>
                      </>
                    )}
                    <LanguageDropdown />
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
                {t('navigation.footer.about_game')}
              </a>
              <a
                onClick={() => {
                  navigate('/about_author');
                }}
                target="_blank"
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                {t('navigation.footer.about_author')}
              </a>
              <a
                onClick={() => {
                  navigate('/project_page');
                }}
                target="_blank"
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                {t('navigation.footer.project_page')}
              </a>
              <a
                onClick={() => {
                  navigate('/submit_question');
                }}
                target="_blank"
                className="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
              >
                {t('navigation.footer.submit_question')}
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
          <div className="row">
            <div className="col-8 mx-auto text-center mt-1">
              <p className="mb-0 text-secondary">
                Copyright ©{' '}
                <script>document.write(new Date().getFullYear())</script> Piotr
                Chrusciel.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
