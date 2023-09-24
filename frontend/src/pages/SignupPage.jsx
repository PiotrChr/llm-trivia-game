import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { signup } from '../services/api';
import { Row } from 'react-bootstrap';
import { useAuth } from '../routing/AuthProvider';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const response = await signup(username, email, password);

        if (response.status === 201) {
          setUser(response.data.user);
          navigate('/game/welcome');
        } else {
          setError('Signup failed.');
        }
      } catch (err) {
        setError('Signup failed.');
      }
    }

    setValidated(true);
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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 text-center mx-auto">
              <h1 className="text-white mb-2 mt-5">Welcome!</h1>
              <p className="text-lead text-white">
                Use these awesome forms to login or create a new account in your
                project for free.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mt-lg-n10 mt-md-n11 mt-n10">
          <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div className="card z-index-0">
              <div className="card-header text-center pt-4">
                <h5>Register with</h5>
              </div>
              <div className="row px-xl-5 px-sm-4 px-3">
                {/* Social Buttons Here */}
              </div>
              <div className="mt-2 position-relative text-center">
                <p className="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3">
                  or
                </p>
              </div>
              <Row className="px-3">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  {' '}
                  {/* use validated state here */}
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please choose a username.
                    </Form.Control.Feedback>{' '}
                    {/* add feedback for user */}
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email.
                    </Form.Control.Feedback>{' '}
                    {/* add feedback for user */}
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
                    </Form.Control.Feedback>{' '}
                    {/* add feedback for user */}
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
                      I agree the{' '}
                      <a
                        onClick={() => {}}
                        className="text-dark font-weight-bolder"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </Form.Check>
                  <div className="text-center">
                    <Button
                      variant="none"
                      type="submit"
                      className="bg-gradient-dark w-100 my-4 mb-2"
                    >
                      Signup
                    </Button>
                  </div>
                  <p className="text-sm mt-3 mb-3">
                    Already have an account?{' '}
                    <a
                      href="#"
                      onClick={() => navigate('/login')}
                      className="text-dark font-weight-bolder"
                    >
                      Sign in
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
  );
}

export default SignupPage;
