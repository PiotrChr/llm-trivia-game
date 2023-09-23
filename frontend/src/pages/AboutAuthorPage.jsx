import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routing/AuthProvider';
import { Col, Row } from 'react-bootstrap';

function AboutAuthorPage() {
  const [leaders, setLeaders] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{ borderRadius: '0px 0px 24px 24px' }}
      >
        <span className="mask bg-gradient-secondary opacity-6"></span>
      </div>
      <div className="container">
        <Card className="card-body blur shadow-blur mx-4 mt-n4 overflow-hidden">
          <h4 className="text-xs mb-0">Game list</h4>
        </Card>
      </div>
      <div className="container mt-6">
      <Row>
        <Col sm={12}>
          <h1 className="mb-4">About the Author</h1>
        </Col>

        <Col sm={12} md={4}>
          {/* Placeholder for author's image */}
          <Image src="path_to_author_image.jpg" roundedCircle width="200" alt="Author's Image" className="mb-4"/>
        </Col>

        <Col sm={12} md={8}>
          {/* Brief description about the author */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Brief Description</Card.Title>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt, nibh sit amet commodo convallis.
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Author's Qualifications */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Qualifications</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Lorem ipsum dolor sit amet.</ListGroup.Item>
                <ListGroup.Item>Consectetur adipiscing elit.</ListGroup.Item>
                <ListGroup.Item>Vestibulum commodo convallis mauris.</ListGroup.Item>
                {/* ... add more qualifications */}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Author's Achievements */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Achievements</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Lorem ipsum dolor sit amet.</ListGroup.Item>
                <ListGroup.Item>Consectetur adipiscing elit.</ListGroup.Item>
                <ListGroup.Item>Vestibulum commodo convallis mauris.</ListGroup.Item>
                {/* ... add more achievements */}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Short Timeline or History related to game development */}
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Timeline</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>2021: Started working on the trivia game project.</ListGroup.Item>
                <ListGroup.Item>2022: Integrated LLM for enhanced question generation.</ListGroup.Item>
                <ListGroup.Item>2023: Released the multiplayer version of the game.</ListGroup.Item>
                {/* ... add more timeline items */}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
    </section>
  );
}

export default AboutAuthorPage;
