import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Card, Button, Container } from 'react-bootstrap';
import { useAuth } from '../routing/AuthProvider';
import { login } from '../services/api';
import { GoogleSSOButton } from '../components/shared/GoogleSSOButton';
import { Jumbo } from '../components/Layout/Jumbo';
import { useTranslation } from 'react-i18next';
import { useHandleLogin } from '../services/hooks/useHandleLogin';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleLogin } = useHandleLogin();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const response = await login(username, password);

        if (response.status === 200) {
          handleLogin(response.data.access_token, response.data.refresh_token);
        } else {
          setError(t('common.errors.invalid_credentials'));
        }
      } catch (err) {
        setError(t('common.errors.invalid_credentials'));
      }
    }

    setValidated(true);
  };

  return (
    <div>
      <Jumbo url="/static/img/jumbotron/signup/3.jpg" scrollToContent={true} />
      <section className="min-vh-80 mb-8">
        <Container>
          <Row className="mt-lg-n10 mt-md-n11 mt-n10">
            <Col xl={4} lg={5} md={7} className="mx-auto">
              <Card className="z-index-0">
                <Card.Header className="text-center pt-4">
                  <h5>{t('login.login_with')}</h5>
                </Card.Header>
                <div className="d-flex flex-row align-items-center justify-content-center px-3">
                  <GoogleSSOButton callback={handleLogin} />
                </div>
                <div className="mt-2 position-relative text-center">
                  <p className="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3">
                    {t('common.or')}
                  </p>
                </div>
                <Row className="px-3">
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <Form.Group controlId="formBasicUsername">
                      <Form.Label>{t('common.username')}</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('login.choose_username')}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>{t('common.password')}</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('login.provide_password')}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="text-center">
                      <Button
                        variant="none"
                        type="submit"
                        className="bg-gradient-dark w-100 my-4 mb-2"
                      >
                        {t('common.login')}
                      </Button>
                    </div>
                  </Form>
                  {error && <p>{error}</p>}
                </Row>
                <Card.Footer className="text-center pt-0 px-lg-2 px-1">
                  <p className="mb-4 mt-4 text-sm mx-auto">
                    {t('login.no_account_q')}
                    <a
                      onClick={() => {
                        navigate('/signup');
                      }}
                      className="text-info text-gradient font-weight-bold ms-2"
                    >
                      {t('common.sign_up')}
                    </a>
                  </p>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default LoginPage;
