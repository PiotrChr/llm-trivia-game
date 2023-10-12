import React, { useContext } from 'react';
import { Jumbotron, Button, Container } from 'react-bootstrap';
import { useAuth } from '../routing/AuthProvider';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <div
        className="p-5 text-center bg-image rounded-3 position-relative"
        style={{
          backgroundImage: 'url("static/img/jumbotron/5.png")',
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="mask">
          <div
            className="d-flex justify-content-center h-100"
            style={{ marginTop: '30vh' }}
          >
            <div className="text-white">
              <h1 className="mb-3">{t('home.title')}</h1>
              <h4 className="mb-3">Subheading</h4>
              <p>{t('common.sub_heading')}</p>
              <p style={{ marginTop: '15vh' }}>
                {!user && (
                  <>
                    <Button
                      variant="primary"
                      href="/signup"
                      size="lg"
                      className="mr-3 btn-round"
                    >
                      {t('navigation.user.signup')}
                    </Button>
                    <Button
                      variant="secondary"
                      href="/login"
                      size="lg"
                      className="btn-round"
                    >
                      {t('navigation.user.login')}
                    </Button>
                  </>
                )}
                {user && (
                  <Button
                    variant="primary"
                    href="/game/welcome"
                    size="lg"
                    className="btn-round"
                  >
                    {t('common.play_now')}
                  </Button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <h2>About the Game</h2>
        <p>{t('home.heading')}</p>
      </Container>
    </div>
  );
};

export default HomePage;
