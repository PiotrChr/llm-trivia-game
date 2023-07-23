import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { UserContext } from '../UserContext';
import { signup } from '../services/api';

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false); // add validated state
  const { setUser } = useContext(UserContext);
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
          setError("Signup failed.");
        }
      } catch (err) {
        setError("Signup failed.");
      }
    }

    setValidated(true); // set validated to true after checking form validity
  }

  return (
    <div className="signup-page">
      <h1>Signup</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}> {/* use validated state here */}
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback> {/* add feedback for user */}
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback> {/* add feedback for user */}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Form.Control.Feedback type="invalid">Please provide a password.</Form.Control.Feedback> {/* add feedback for user */}
        </Form.Group>
        <Button variant="primary" type="submit">
          Signup
        </Button>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SignupPage;