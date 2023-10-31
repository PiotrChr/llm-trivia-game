import React from 'react';
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationDropdown from '../../Layout/NotificationsDropdown';
import LanguageDropdown from '../Translation/LanguageDropdown';

export const MainNav = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const GameNav = () => (
    <Nav className="flex-row game-nav">
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
              <i className="bi-joystick me-2"></i> {t('navigation.play.play')}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/game/list">
                <i className="bi-list-ul me-2"></i> {t('navigation.play.list')}
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
              <i className="bi-person-circle me-2"></i> {user.name}
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
  );

  return (
    <Navbar
      variant="none"
      expand="lg"
      id="main-navbar"
      className="blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4 px-2"
    >
      <Container fluid className="pe-0 nav-container">
        <Navbar.Brand
          href="/"
          className="font-weight-bolder ms-lg-0 ms-3 d-flex flex-row align-items-center py-0"
        >
          <img
            src={'/static/img/logo/logo.png'}
            className="d-inline-block align-text-top me-3"
            alt="logo"
            height="35"
          />
          <span>{t('navigation.main.title')}</span>
        </Navbar.Brand>
        <GameNav />
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="shadow-none ms-2 border-0"
        >
          <i className="bi-list"></i>{' '}
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className="main-nav">
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
              active={'/leaderboard'}
              className="align-items-center me-2"
            >
              {t('navigation.main.leaderboard')}
            </Nav.Link>
            <Nav.Link
              href="/about_game"
              active={location.pathname === '/about_game'}
              className="align-items-center me-2"
            >
              {t('navigation.main.about_game')}
            </Nav.Link>
            <Nav.Link
              href="/submit_question"
              active={location.pathname === '/submit_question'}
              className="align-items-center me-2 font-weight-bold"
            >
              {t('navigation.main.submit_question')}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
