import React from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const GameOverCard = ({ gameId, score, won }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Col size={12} className="d-flex">
      <h1>{'common.game_over'}</h1>

      <p className="mt-5">
        {won
          ? t('game_over.game_won_message', { score })
          : t('game_over.game_over_message', { score })}
      </p>

      <button className="btn btn-primary" onClick={() => navigate('/')}>
        {'common.home'}
      </button>

      <button
        className="btn btn-primary"
        onClick={() => navigate('/game/stats/' + gameId)}
      >
        {'common.game_stats'}
      </button>
    </Col>
  );
};
