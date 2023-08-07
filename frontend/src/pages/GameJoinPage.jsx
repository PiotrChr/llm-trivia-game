import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { joinGame } from '../services/api';

function GameJoinPage() {
    const [currentGameId, setGameId] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    
    const { gameId } = useParams();

    useEffect(() => {
        if (gameId) {
            setGameId(gameId);
        }
    }, [gameId]);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const response = await joinGame(currentGameId, password);
            console.log(response)
            if (response.code !== 200) {
                alert('Failed to join game');
                return;
            }

            navigate('/game/' + currentGameId);
        }

        setValidated(true);
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <Row>
            <Col md={{ span: 12}}>
            <Card className="p-4">
                <Card.Body>
                <h2 className="text-center mb-4">Join a Game</h2>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId="formGameId">
                        <Form.Label>Game ID</Form.Label>
                        <Form.Control type="input" value={currentGameId} onChange={e => setGameId(e.target.value)} required />
                        <Form.Control.Feedback type="invalid">Please provide a valid game ID.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password (Optional)</Form.Label>
                        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3">
                        Join Game
                    </Button>
                </Form>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
  );
}

export default GameJoinPage;