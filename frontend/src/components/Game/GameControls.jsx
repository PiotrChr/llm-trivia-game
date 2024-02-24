import React from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Col,
    Row,
  } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ReadyButton } from './GameControls/ReadyButton';
import { HostControls } from './GameControls/HostControls';
import { ReportQuestionButton } from './GameControls/ReportQuestionButton';


export const GameControls = (props) => {
    const { t } = useTranslation();

    return (
        <Row id="game-controls">
            <Col size={12} className="d-flex flex-column flex-lg-row">
                <ReadyButton
                    handleReady={props.handleReady}
                    isReady={props.isReady}
                />
                {props.gameStarted && props.allAnswered && !props.autoStart && (
                    <Button
                        className="btn-sm mb-0 me-3 mt-2 mt-lg-0 btn-icon"
                        onClick={props.handleNextQuestionClick}
                    >
                        {/* {t('game.next_question')} */}
                        <i className="bi-fast-forward-fill"></i>
                    </Button>
                )}
                {props.questionReady && (
                    <ReportQuestionButton
                        question={props.question}
                        onReport={props.onReport}
                    />
                )}
                {props.isHost &&
                    <HostControls 
                        paused={props.paused}
                        gameStarted={props.gameStarted}
                        allReady={props.allReady}
                        language={props.language}
                        languages={props.languages}
                        handlePauseGame={props.handlePauseGame}
                        handleResumeGame={props.handleResumeGame}
                        handleStartGame={props.handleStartGame}
                        handleStopGame={props.handleStopGame}
                        handleLanguageChange={props.handleLanguageChange}
                    />
                }
            </Col>
        </Row>
    )
}

GameControls.propTypes = {
    handleReady: PropTypes.func,
    handleStartGame: PropTypes.func,
    handleResumeGame: PropTypes.func,
    handlePauseGame: PropTypes.func,
    handleStopGame: PropTypes.func,
    handleNextQuestionClick: PropTypes.func,
    handleCategoryChange: PropTypes.func,
    handleDifficultyChange: PropTypes.func,
    handleLanguageChange: PropTypes.func,
    onReport: PropTypes.func,
    questionReady: PropTypes.bool,
    question: PropTypes.object,
    user: PropTypes.object,
    isHost: PropTypes.bool,
    gameStarted: PropTypes.bool,
    allReady: PropTypes.bool,
    isReady: PropTypes.func,
    allAnswered: PropTypes.bool,
    paused: PropTypes.bool,
    autoStart: PropTypes.number,
    languages: PropTypes.arrayOf(PropTypes.object),
    language: PropTypes.object,
    gameMode: PropTypes.object,
    category: PropTypes.object,
    categories: PropTypes.arrayOf(PropTypes.object),
    difficultyOptions: PropTypes.arrayOf(PropTypes.object)
}