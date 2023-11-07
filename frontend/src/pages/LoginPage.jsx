import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Form, Row, Col, Card, Button, Container } from 'react-bootstrap';
import { useAuth } from '../routing/AuthProvider';
import { login } from '../services/api';
import { decode } from '../utils';
import { GoogleSSOButton } from '../components/shared/GoogleSSOButton';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false); // add validated state
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const response = await login(username, password);

        if (response.status === 200) {
          Cookies.set('token', response.data.access_token);
          Cookies.set('refresh_token', response.data.refresh_token);

          const token = decode(response.data.access_token);

          setUser({
            id: token.sub.id,
            name: token.sub.name
          });

          navigate('/');
        } else {
          setError('Invalid credentials.');
        }
      } catch (err) {
        setError('Invalid credentials.');
      }
    }

    setValidated(true); // set validated to true after checking form validity
  };

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{
          backgroundImage: '/static/assets/img/curved-images/curved14.jpg',
          borderRadius: '0px 0px 24px 24px'
        }}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} className="text-center mx-auto">
              <h1 className="text-white mb-2 mt-5">Welcome!</h1>
              <p className="text-lead text-white">
                Use these awesome forms to login or create a new account in your
                project for free.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="mt-lg-n10 mt-md-n11 mt-n10">
          <Col xl={4} lg={5} md={7} className="mx-auto">
            <Card className="z-index-0">
              <Card.Header className="text-center pt-4">
                <h5>Login with</h5>
              </Card.Header>
              <Row className="px-xl-5 px-sm-4 px-3">
                {/* Social Buttons Here */}
              </Row>
              <div className="mt-2 position-relative text-center">
                <p className="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3">
                  or
                </p>
              </div>
              <Row className="px-3">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please choose a username.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center">
                    <Button
                      variant="none"
                      type="submit"
                      className="bg-gradient-dark w-100 my-4 mb-2"
                    >
                      Log in
                    </Button>
                    <GoogleSSOButton />
                  </div>
                </Form>
                {error && <p>{error}</p>}
              </Row>
              <Card.Footer className="text-center pt-0 px-lg-2 px-1">
                <p className="mb-4 mt-4 text-sm mx-auto">
                  Don't have an account?
                  <a
                    onClick={() => {
                      navigate('/signup');
                    }}
                    className="text-info text-gradient font-weight-bold ms-2"
                  >
                    Sign up
                  </a>
                </p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LoginPage;
