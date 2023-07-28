import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import classNames from 'classnames';


const QuestionCard = ({ question, answers, handleAnswerClicked, selectedAnswerId, correctAnswerId }) => (
  <Card className="mb-4">
      <Card.Body>
          <Card.Title className="mb-3 p-5">{question.question}</Card.Title>

          <Container>
              <Row className="justify-content-md-center">
                  {answers.map((answer, index) => (
                      <Col xs={12} sm={6} key={index} className="mb-2 d-grid">
                          <Button 
                              className={classNames(
                                selectedAnswerId === answer.id && "active",
                                correctAnswerId !== null && correctAnswerId === answer.id ? "correct" : "incorrect"
                              )}
                              variant={"outline-primary"}
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

export default QuestionCard;