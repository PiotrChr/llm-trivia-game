import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { StepControls } from '../StepControls';

export const GameOptionsStep = ({
  setGamePassword,
  gamePassword,
  nextStep,
  previousStep,
  language,
  setLanguage,
  languages,
  setIsPublic,
  isPublic,
  maxPlayers,
  setMaxPlayers
}) => {
  const { t } = useTranslation();

  const selectLanguage = (language) => {
    setLanguage(language);
  };

  return (
    <Container className="host-game-step">
      <h3 className="text-center w-100 mb-5">{t('game_host.game_options')}</h3>
      <Row>
        <Form.Group controlId="formGameIsPublic">
          <Form.Label>{t('game_host.is_public')}</Form.Label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchIsPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="formMaxPlayers">
          <Form.Label>
            {t('common.max_players')}:{' '}
            {maxPlayers !== 0 ? `${maxPlayers} players` : 'No limit'}
          </Form.Label>
          <Form.Control
            type="range"
            min="0"
            max="100"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
          <Form.Text className="text-muted">
            {t('game_host.max_players_label')}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formGamePassword">
          <Form.Label>{t('game_host.game_password')}</Form.Label>
          <Form.Control
            type="password"
            value={gamePassword}
            onChange={(e) => {
              setGamePassword(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            {t('game_host.errors.invalid_game_password')}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLanguage" className="mt-3">
          <Form.Label>{t('common.language')}</Form.Label>
          <Select
            value={language}
            options={languages}
            onChange={(newValue) => selectLanguage(newValue)}
            required
          />
          <Form.Control.Feedback type="invalid">
            {t('game_host.select_language')}
          </Form.Control.Feedback>
        </Form.Group>
        <StepControls nextStep={nextStep} previousStep={previousStep} t={t} />
      </Row>
    </Container>
  );
};
