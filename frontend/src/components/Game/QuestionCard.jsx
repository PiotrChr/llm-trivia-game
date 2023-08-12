import React, { useCallback } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';


const QuestionCard = ({ question, answers, handleAnswerClicked, selectedAnswerId, player_answers}) => {
  console.log(player_answers);
  console.log(answers);

  const getVariant = useCallback((answer) => {
    let variant;

    if (selectedAnswerId === answer.id) {
        if (player_answers.length > 0) {
            variant = answer.is_correct ? 'success' : 'danger';
        } else {
            variant = 'primary';
        }
    } else {
        if (player_answers.length > 0 && answer.is_correct) {
            variant = 'outline-success';
        } else {
            variant = 'outline-primary';
        }
    }

    return variant;
  }, [selectedAnswerId, player_answers, answers]);

  return (
        <Card className="mb-4 shadow-none">
            <Card.Body>
                <Card.Title className="mb-3 p-5">{question.question}</Card.Title>

                <Container>
                    <Row className="justify-content-md-center">
                        {answers.map((answer, index) => {
                            const number_of_answers = player_answers.filter((player_answer) => player_answer.answer_id === answer.id).length;
                                return(
                                    <Col xs={12} sm={6} key={index} className="mb-2 d-grid">
                                    <Button
                                        className="position-relative"
                                        variant={getVariant(answer)}
                                        onClick={() => { handleAnswerClicked(answer.id) }}
                                        disabled={selectedAnswerId !== null}
                                    >
                                        {answer.text}

                                        {player_answers.length > 0 && number_of_answers > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                                                { number_of_answers }
                                            </span>
                                        )}
                                        
                                    </Button>
                                </Col>
                                )
                        })}
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