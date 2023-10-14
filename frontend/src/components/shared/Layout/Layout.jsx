import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../routing/AuthProvider';
import { MainNav } from './MainNav';

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
            <MainNav user={user} />
          </Col>
        </Row>
      </Container>

      <main className="main-content mt-0">{children}</main>

      <footer style={{ marginTop: '150px' }}>
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
