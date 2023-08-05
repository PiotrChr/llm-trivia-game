import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';


const QuestionCard = ({ question, answers, handleAnswerClicked, selectedAnswerId, player_answers}) => {
  console.log(player_answers);  
  console.log(selectedAnswerId);
  console.log(answers);
  return (
        <Card className="mb-4 shadow-none">
            <Card.Body>
                <Card.Title className="mb-3 p-5">{question.question}</Card.Title>

                <Container>
                    <Row className="justify-content-md-center">
                        {answers.map((answer, index) => (
                            <Col xs={12} sm={6} key={index} className="mb-2 d-grid">
                                <Button 
                                    variant={
                                        selectedAnswerId === answer.id 
                                            ? (player_answers.length > 0
                                                ? (answer.is_correct === 'true' ? "success" : "danger")
                                                : "primary")
                                            : "outline-primary"
                                    }
                                    disabled={selectedAnswerId !== null}
                                    onClick={() => handleAnswerClicked(answer.id)}
                                >
                                    {answer.text}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
};

QuestionCard.defaultProps = {
    selectedAnswerId: null,
    player_answers: []
};

export default QuestionCard;