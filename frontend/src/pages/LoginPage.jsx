import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../UserContext';
import { login } from '../services/api';


function LoginPage() {
  const [username, setUsername] = useState("");
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
        const response = await login(username, password);

        if (response.status === 200) {
          setUser(username);
          navigate('/');
        } else {
          setError("Invalid credentials.");
        }
      } catch (err) {
        setError("Invalid credentials.");
      }
    }

    setValidated(true); // set validated to true after checking form validity
  }

  return (
    <div className="login-page">
      <h1>Login</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}> {/* use validated state here */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="input" value={username} onChange={e => setUsername(e.target.value)} required />
          <Form.Control.Feedback type="invalid">Please provide a valid username.</Form.Control.Feedback> {/* add feedback for user */}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Form.Control.Feedback type="invalid">Please provide a password.</Form.Control.Feedback> {/* add feedback for user */}
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;