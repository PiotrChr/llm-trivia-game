import React from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Col,
    Row,
  } from 'react-bootstrap';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import ReportQuestion from './ReportQuestion';


export const GameControls = (props) => {
    const { t } = useTranslation();

    return (
        <Row id="game-controls">
            <Col size={12} className="d-flex flex-column flex-lg-row">
                <Button
                variant="none"
                onClick={props.handleReady}
                className={
                    'btn-sm mb-0 me-2 mt-2 mt-lg-0 ' +
                    (props.isReady(props.user)
                    ? 'disabled btn-success'
                    : 'btn-outline-success')
                }
                >
                {t('game.ready')}
                </Button>
                {props.isHost && !props.gameStarted && props.allReady && (
                <Button
                    className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
                    onClick={props.handleStartGame}
                >
                    {/* {t('game.start_game')} */}
                    <i className="bi-play-fill"></i>
                </Button>
                )}
                {props.gameStarted && props.isHost && (
                <>
                    {props.paused ? (
                    <Button
                        className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
                        onClick={props.handleResumeGame}
                    >
                        {/* {t('game.resume_game')} */}
                        <i className="bi-play-fill"></i>
                    </Button>
                    ) : (
                    <Button
                        className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
                        onClick={props.handlePauseGame}
                    >
                        {/* {t('game.pause_game')} */}
                        <i className="bi-pause-fill"></i>
                    </Button>
                    )}

                    <Button
                        className="btn-sm mb-0 me-2 mt-2 mt-lg-0 btn-icon"
                        onClick={props.handleStopGame}
                    >
                        {/* {t('game.stop_game')} */}
                        <i className="bi-stop-fill"></i>
                    </Button>
                </>
                )}
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
                <Button
                    variant="danger"
                    className="btn-sm mb-0 me-2 mt-2 mt-lg-0"
                    onClick={() =>
                    showModal(
                        <ReportQuestion
                        question={props.question}
                        onSubmit={props.onReport}
                        />,
                        t('game.report_question')
                    )
                    }
                >
                    {t('game.report_question')}
                </Button>
                )}
                {props.isHost &&
                props.gameMode &&
                props.gameMode.name === 'Custom' && (
                    <>
                    <Select
                        className="mx-2 flex-grow-1 mt-2 mt-lg-0"
                        options={props.categories}
                        value={{ label: props.category.name, value: props.category.id }}
                        onChange={props.handleCategoryChange}
                        onCreateOption={props.handleCategoryChange}
                        formatCreateLabel={(inputValue) =>
                        `Add "${inputValue}"`
                        }
                        isSearchable
                        isClearable
                    />
                    <Select
                        className="mx-2 flex-grow-1 mt-2 mt-lg-0"
                        options={props.difficultyOptions}
                        value={props.difficultyOptions[props.difficulty - 1]}
                        onChange={props.handleDifficultyChange}
                    />
                    <Select
                        className="mx-2 flex-grow-1 mt-2 mt-lg-0"
                        options={props.languages}
                        value={{
                        label: props.language.name,
                        value: props.language.iso_code
                        }}
                        onChange={props.handleLanguageChange}
                        isSearchable
                        defaultValue={{ label: 'English', value: 'en' }}
                    />
                    </>
                )}
                
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