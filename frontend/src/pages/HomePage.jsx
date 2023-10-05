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
          backgroundImage: "url('static/img/jumbotron_image.png')",
          height: '400px',
          backgroundSize: 'cover'
        }}
      >
        <div className="mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <h1 className="mb-3">{t('home.title')}</h1>
              <h4 className="mb-3">Subheading</h4>
              <p>
                Test your knowledge across a wide range of topics with the LLM
                Trivia Game. Can you beat the high score?
              </p>
              <p>
                {!user && (
                  <>
                    <Button
                      variant="primary"
                      href="/signup"
                      size="lg"
                      className="mr-3"
                    >
                      Signup
                    </Button>
                    <Button variant="secondary" href="/login" size="lg">
                      Login
                    </Button>
                  </>
                )}
                {user && (
                  <Button variant="primary" href="/game/welcome" size="lg">
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
