import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Card, Container, Row, Col } from 'react-bootstrap';
import StepWizard from 'react-step-wizard';
import { useTranslation } from 'react-i18next';

import {
  createGame,
  getCategories,
  getLanguages,
  getGameModes,
  getLifelineTypes
} from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';

import { LanguageStep } from '../components/Host/Steps/LanguageStep';
import { CategoryStep } from '../components/Host/Steps/CategoryStep';
import { QuestionOptionsStep } from '../components/Host/Steps/QuestionOptionsStep';
import { GameOptionsStep } from '../components/Host/Steps/GameOptionsStep';
import { GameModeStep } from '../components/Host/Steps/GameModeStep';
import { FinalStep } from '../components/Host/Steps/FinalStep';

import { Jumbo } from '../components/Layout/Jumbo';

import config from '../config.json';

const GameHostPage = () => {
  const [gamePassword, setGamePassword] = useState('');
  const [maxQuestions, setMaxQuestions] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [language, setLanguage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [category, setCategory] = useState(null);
  const [allSelected, selectAll] = useState(true);
  const [gameMode, setGameMode] = useState(null);
  const [gameModes, setGameModes] = useState([]);
  const [validated, setValidated] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [lifelines, setLifeLines] = useState([]);
  const [eliminateOnFail, setEliminateOnFail] = useState(false);
  const [selectedLifelines, setSelectedLifeLines] = useState(
    config.game.modes['Classic'].lifelines
  );
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { t } = useTranslation();

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
          value: gameMode.id,
          description: gameMode.description
        }))
      );
    };

    const fetchLifelines = async () => {
      const result = await getLifelineTypes();
      setLifeLines(
        result.data.map((lifeline) => ({
          label: lifeline.name,
          value: lifeline.id,
          description: lifeline.description
        }))
      );
    };

    fetchLifelines();
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
      console.log('gameData', {
        gamePassword,
        category,
        language,
        maxQuestions,
        timeLimit,
        autoStart,
        selectedLifelines
      });

      try {
        const game = await createGame(
          gameMode ? gameMode.value : null,
          gamePassword,
          category ? category.value : null,
          allSelected,
          timeLimit,
          maxQuestions,
          language ? language.value : null,
          autoStart,
          eliminateOnFail,
          selectedLifelines
        );

        if (!game) {
          showAlert(
            t('common.errors.error'),
            t('common.errors.something_went_wrong'),
            null,
            {
              variant: 'danger',
              position: 'bottom'
            }
          );
          return;
        }

        navigate('/game/' + game.data.id);
      } catch (err) {
        showAlert(
          t('common.errors.error'),
          t('common.errors.something_went_wrong'),
          err.message,
          {
            variant: 'danger',
            position: 'bottom'
          }
        );
        return;
      }
    }

    setValidated(true);
  };

  const handleSetGameMode = (mode) => {
    setGameMode(mode);

    if (['Classic', 'Survival', 'Marathon'].includes(mode.label)) {
      const gameMode = config.game.modes[mode.label];

      setMaxQuestions(gameMode.maxQuestions);
      setTimeLimit(gameMode.timeLimit);
      setAutoStart(gameMode.autoStart);
      setSelectedLifeLines(gameMode.lifelines);
      selectAll(gameMode.allCategories);
      setCategories(gameMode.categories);
      setEliminateOnFail(gameMode.eliminateOnFail);
    }
  };

  return (
    <div>
      <Jumbo url="/static/img/jumbotron/host-a-game/1.png">
        <Card
          className="p-4"
          style={{ minWidth: '50vw', background: 'rgba(255,255,255,0.98)' }}
        >
          <Card.Body>
            <h2 className="text-center mb-4">{t('common.host_a_game')}</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <StepWizard>
                <GameModeStep
                  setGameMode={handleSetGameMode}
                  gameMode={gameMode}
                  gameModes={gameModes}
                />
                {gameMode && gameMode.label === 'Custom' && (
                  <CategoryStep
                    stepName="Category"
                    setCategory={setCategory}
                    category={category}
                    categories={categories}
                    selectAll={selectAll}
                    allSelected={allSelected}
                  />
                )}
                {gameMode && gameMode.label === 'Custom' && (
                  <QuestionOptionsStep
                    stepName="Question Options"
                    maxQuestions={maxQuestions}
                    timeLimit={timeLimit}
                    autoStart={autoStart}
                    setMaxQuestions={setMaxQuestions}
                    setTimeLimit={setTimeLimit}
                    setAutoStart={setAutoStart}
                    lifelines={lifelines}
                    setSelectedLifeLines={setSelectedLifeLines}
                    selectedLifelines={selectedLifelines}
                  />
                )}
                <GameOptionsStep
                  stepName="Game Options"
                  setLanguage={setLanguage}
                  language={language}
                  languages={languages}
                  gamePassword={gamePassword}
                  setGamePassword={setGamePassword}
                />
                <FinalStep
                  stepName="Final Step"
                  startGame={handleSubmit}
                  summary={{
                    gamePassword,
                    maxQuestions,
                    timeLimit,
                    language: language ? language.label : '',
                    category: category ? category.label : '',
                    allSelected,
                    gameMode: gameMode ? gameMode.label : '',
                    autoStart,
                    selectedLifelines
                  }}
                />
              </StepWizard>
            </Form>
          </Card.Body>
        </Card>
      </Jumbo>
    </div>
  );
};

export default GameHostPage;
