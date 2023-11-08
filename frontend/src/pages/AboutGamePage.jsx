import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routing/AuthProvider';
import { Col, Row } from 'react-bootstrap';
import { Jumbo } from '../components/Layout/Jumbo';
import { ListGroup } from 'react-bootstrap';

function AboutGamePage() {
  const [leaders, setLeaders] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div>
      <Jumbo
        url="static/img/jumbotron/about-game-and-rules/3.jpg"
        scrollToContent={true}
      ></Jumbo>

      <section>
        <div className="container mt-6">
          <Row>
            <Col sm={12}>
              <h1 className="mb-4">Game Rules & Information</h1>

              <p>
                This is a trivia game powered by both React (frontend) and Flask
                (backend). At the heart of the game's engine is the LLM, which
                facilitates the generation of trivia questions across an
                extensive range of categories. Furthermore, due to the
                integration with LLM, the game possesses the ability to
                translate questions to nearly any language and also ensures
                their validation and enhancement.
              </p>

              <p>
                The game architecture is comprised of both backend and frontend
                servers. It employs a consistent mechanism that inspects the
                game database to identify and subsequently translate any
                reported questions.
              </p>

              <h3 className="mt-4">Current Features</h3>
              <ListGroup className="mb-4">
                <ListGroup.Item>Never-ending question stream</ListGroup.Item>
                <ListGroup.Item>
                  Support for the majority of world languages
                </ListGroup.Item>
                <ListGroup.Item>
                  5 difficulty levels (currently in development)
                </ListGroup.Item>
                <ListGroup.Item>In-Game Chat functionality</ListGroup.Item>
                <ListGroup.Item>
                  Insightful Game and User statistics
                </ListGroup.Item>
                <ListGroup.Item>Life-lines for aiding gameplay</ListGroup.Item>
                <ListGroup.Item>
                  Capability to report questions, with automatic LLM repair
                </ListGroup.Item>
                <ListGroup.Item>
                  Quick and easy deployment options
                </ListGroup.Item>
                <ListGroup.Item>
                  Swift installation process through Docker
                </ListGroup.Item>
                <ListGroup.Item>Leaderboard to rank top players</ListGroup.Item>
                <ListGroup.Item>
                  Robust User Authentication using JWT
                </ListGroup.Item>
                <ListGroup.Item>Exciting Multiplayer mode</ListGroup.Item>
                <ListGroup.Item>
                  The pre-built game database is already stocked with 50
                  questions per category (spanning 100 categories in total)
                </ListGroup.Item>
              </ListGroup>

              <h3 className="mt-4">Upcoming Features & Todos</h3>
              <ListGroup>
                {[
                  'Player Profile Page: Introducing a profile page featuring user stats, complete with visual charts',
                  'Game Handling: Ensuring the game stops or pauses if the host exits',
                  'Game Handling: Updating the requiredPlayers array if a new player joins an ongoing game'
                  // ... Add all other features and todos from the list
                ].map((todo, index) => (
                  <ListGroup.Item key={index}>{todo}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

export default AboutGamePage;
