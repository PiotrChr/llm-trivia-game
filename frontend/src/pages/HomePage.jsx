import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useAuth } from '../routing/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Jumbo } from '../components/Layout/Jumbo';

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <Jumbo url="/static/img/jumbotron/5.jpg" maskClasses="home-page-mask">
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
                  className="me-3 btn-round"
                >
                  {t('navigation.user.signup')}
                </Button>
                <Button
                  variant="secondary"
                  href="/login"
                  size="lg"
                  className="btn-round mt-lg-0 mt-0"
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
      </Jumbo>
      <Container>
        <h2>About the Game</h2>
        <p>{t('home.heading')}</p>
      </Container>
    </div>
  );
};

export default HomePage;
