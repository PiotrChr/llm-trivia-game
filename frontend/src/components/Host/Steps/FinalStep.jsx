import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';
import { StepControls } from '../StepControls';

export const FinalStep = ({ startGame, summary, previousStep }) => {
  const { t } = useTranslation();

  const Summary = ({
    maxQuestions,
    timeLimit,
    language,
    categories,
    allSelected,
    gameMode,
    autoStart,
    selectedLifelines,
    isPublic
  }) => {
    return (
      <div className="final-step">
        <h3>{t('game_host.game_summary')}</h3>
        <div className="mt-3">
          <p className="p-game-option d-flex">
            <span className="description">{t('common.game_password')}: </span>
            <span className="value">***</span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.max_questions')}: </span>
            <span className="value">{maxQuestions}</span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.time_limit')}: </span>
            <span className="value">{timeLimit}</span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.language')}: </span>
            <span className="value">{language}</span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.category')}: </span>
            <span className="value">
              {
                categories.reduce((acc, category) => acc + category + ', ', '')
              }
            </span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.all_categories')}: </span>
            <span className="value">
              {allSelected ? t('common.yes') : t('common.no')}
            </span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.game_mode')}: </span>
            <span className="value">{gameMode}</span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">
              {t('common.auto_start_round')}:{' '}
            </span>
            <span className="value">
              {autoStart ? t('common.yes') : t('common.no')}
            </span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('game_host.is_public')}:</span>
            <span className="value">
              {isPublic ? t('common.yes') : t('common.no')}
            </span>
          </p>
          <p className="p-game-option d-flex">
            <span className="description">{t('common.lifelines')}: </span>
            <span className="value">
              {selectedLifelines
                .filter((lifeline) => lifeline.count > 0)
                .map(
                  (lifeline) =>
                    t(`lifelines.${lifeline.name}.name`) + ': ' + lifeline.count
                )
                .join(', ')}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <Container className="host-game-step">
      <Row>
        <Col size={12}>
          <Summary {...summary} />
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <StepControls previousStep={previousStep} submit={true} t={t}/>
        </Col>
      </Row>
    </Container>
  );
};

FinalStep.defaultProps = {
  startGame: () => {}
};
