import React from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const GameOverCard = ({ gameId, score, won, onNavigate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Col size={12} className="d-flex flex-column">
      <h1>{t('common.game_over')}</h1>

      <p className="mt-5">
        {won
          ? t('game_over.game_won_message', { score })
          : t('game_over.game_over_message', { score })}
      </p>

      <button
        className="btn btn-primary"
        onClick={() => {
          onNavigate();
          navigate('/');
        }}
      >
        {t('common.home')}
      </button>

      <button
        className="btn btn-primary"
        onClick={() => {
          onNavigate();
          navigate('/game/stats/' + gameId);
        }}
      >
        {t('common.game_stats')}
      </button>
    </Col>
  );
};

GameOverCard.defaultProps = {
  won: false,
  score: 0,
  onNavigate: () => {}
};
