import React from 'react';
import { Button } from 'react-bootstrap';
import { ReportQuestion } from './ReportQuestion';
import { showModal } from '../../Modal';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const ReportQuestionButton = ({ question, onReport }) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="danger"
      className="btn-sm mb-0 me-2 mt-2 mt-lg-0"
      onClick={() =>
        showModal(
          <ReportQuestion question={question} onSubmit={onReport} />,
          t('game.report_question')
        )
      }
    >
      {t('game.report_question')}
    </Button>
  );
};

ReportQuestionButton.propTypes = {
  question: PropTypes.object,
  onReport: PropTypes.func
};
