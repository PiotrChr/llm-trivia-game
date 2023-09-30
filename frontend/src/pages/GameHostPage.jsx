import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card, Container, Row, Col } from 'react-bootstrap';
import StepWizard from 'react-step-wizard';

import { createGame, getCategories, getLanguages } from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';

import { LanguageStep } from '../components/Host/Steps/LanguageStep';
import { CategoryStep } from '../components/Host/Steps/CategoryStep';
import { QuestionOptionsStep } from '../components/Host/Steps/QuestionOptionsStep';
import { GameOptionsStep } from '../components/Host/Steps/GameOptionsStep';
import { GameModeStep } from '../components/Host/Steps/GameModeStep';
import { FinalStep } from '../components/Host/Steps/FinalStep';

const GameHostPage = () => {
  const [gamePassword, setGamePassword] = useState('');
  const [maxQuestions, setMaxQuestions] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [language, setLanguage] = useState(null);
  const [categories, setCategories] = useState([
    { label: 'Sports', value: 'sports' },
    { label: 'History', value: 'history' }
  ]);
  const [languages, setLanguages] = useState([]);
  const [category, setCategory] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [gameModes, setGameModes] = useState([
    { label: 'Classic', value: 'classic' },
    { label: 'Battle Royale', value: 'battle_royale' }
  ]);
  const [validated, setValidated] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(
        result.data.map((category) => ({
          label: category.name,
          value: category.id
        }))
      );
    };
    const fetchLanguages = async () => {
      const result = await getLanguages();
      setLanguages(
        result.data.map((language) => ({
          label: language.name,
          value: language.iso_code
        }))
      );
    };
    const fetchGameModes = async () => {
      const result = await getGameModes();
      setGameModes(
        result.data.map((gameMode) => ({
          label: gameMode.name,
          value: gameMode.id
        }))
      );
    };

    fetchGameModes();
    fetchCategories();
    fetchLanguages();
  }, []);

  const handleCategoryChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      setCategories([...categories, newValue]);
    }
    setCategory(newValue);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const game = await createGame(
          gamePassword,
          category.value,
          timeLimit,
          maxQuestions,
          language.value,
          autoStart
        );

        if (!game) {
          showAlert('Error', 'Something went wrong', null, {
            variant: 'danger',
            position: 'bottom'
          });
          return;
        }

        navigate('/game/' + game.data.id);
      } catch (err) {
        showAlert('Error', 'Something went wrong', err.message, {
          variant: 'danger',
          position: 'bottom'
        });
        return;
      }
    }

    setValidated(true);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col md={{ span: 12 }}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Host a Game</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <StepWizard>
                  <GameModeStep />
                  <CategoryStep
                    stepName="Category"
                    setCategory={setCategory}
                    category={category}
                    categories={categories}
                  />
                  <LanguageStep
                    stepName="Language"
                    setLanguage={setLanguage}
                    language={language}
                    languages={languages}
                  />
                  {gameMode === 'custom' && (
                    <QuestionOptionsStep
                      stepName="Question Options"
                      maxQuestions={maxQuestions}
                      timeLimit={timeLimit}
                      autoStart={autoStart}
                      setMaxQuestions={setMaxQuestions}
                      setTimeLimit={setTimeLimit}
                      setAutoStart={setAutoStart}
                    />
                  )}
                  <GameOptionsStep
                    stepName="Game Options"
                    gamePassword={gamePassword}
                    setGamePassword={setGamePassword}
                  />
                  <FinalStep stepName="Final Step" />
                </StepWizard>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GameHostPage;
