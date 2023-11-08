import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { signup } from '../services/api';
import { Row } from 'react-bootstrap';
import { GoogleSSOButton } from '../components/shared/GoogleSSOButton';
import { Jumbo } from '../components/Layout/Jumbo';
import { useTranslation } from 'react-i18next';
import { useHandleLogin } from '../services/hooks/useHandleLogin';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
        const response = await signup(username, email, password);

        if (response.status === 201) {
          handleLogin(response.data.access_token, response.data.refresh_token);
        } else {
          setError(t('common.errors.signup_failed'));
        }
      } catch (err) {
        setError(t('common.errors.signup_failed'));
      }
    }

    setValidated(true);
  };

  return (
    <div>
      <Jumbo url="/static/img/jumbotron/signup/3.jpg" scrollToContent={true} />

      <section className="min-vh-80 mb-8">
        <div className="container">
          <div className="row mt-lg-n10 mt-md-n11 mt-n10">
            <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
              <div className="card z-index-0">
                <div className="card-header text-center pt-4">
                  <h5>{t('login.signup_with')}</h5>
                </div>
                <div className="d-flex flex-row align-items-center justify-content-center px-3">
                  <GoogleSSOButton callback={handleLogin} />
                </div>
                <div className="mt-2 position-relative text-center">
                  <p className="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3">
                    or
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
                        minLength={3}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('login.choose_username')}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>{t('common.email')}</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('login.provide_valid_email')}
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
                        {t('login.provide_valid_password')}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Check className="mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        checked
                        readOnly
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        {t('common.i_agree_to_the')}
                        <a
                          onClick={() => {}}
                          className="text-dark font-weight-bolder"
                        >
                          {t('terms_and_conditions')}
                        </a>
                      </label>
                    </Form.Check>
                    <div className="text-center">
                      <Button
                        variant="none"
                        type="submit"
                        className="bg-gradient-dark w-100 my-4 mb-2"
                      >
                        {t('common.sign_up')}
                      </Button>
                    </div>
                    <p className="text-sm mt-3 mb-3">
                      {t('login.allready_have_an_account')}
                      <a
                        href="#"
                        onClick={() => navigate('/login')}
                        className="text-dark font-weight-bolder"
                      >
                        {t('common.sign_in')}
                      </a>
                    </p>
                  </Form>
                  {error && <p>{error}</p>}
                </Row>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignupPage;
