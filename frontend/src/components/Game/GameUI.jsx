import React, { useEffect, useMemo } from 'react';
import {
  Button,
  Col,
  Container,
  ProgressBar,
  Row,
  Card,
  Fade
} from 'react-bootstrap';
import Select from 'react-select';
import Countdown from './Countdown';
import QuestionCard from './QuestionCard';
import Sidebar from './SideBar';
import FadeInOut from '../shared/FadeInOut';
import ResultBadge from './ResultBadge';
import Lifelines from './LifeLines';
import QuestionTimer from './QuestionTimer';
import { useTranslation } from 'react-i18next';
import { GameOverCard } from './GameOverCard';
import ReportQuestion from './ReportQuestion';

const GameUI = ({
  state,
  categories,
  difficultyOptions,
  handleCategoryChange,
  handleLanguageChange,
  handleSendMessage,
  displayResult,
  isReady,
  handleDifficultyChange,
  handleReady,
  handleStartGame,
  handleAnswerClicked,
  handleNextQuestionClick,
  handleStopGame,
  handlePauseGame,
  handleResumeGame,
  showModal,
  hideModal,
  user,
  isLoading,
  gameId
}) => {
  const {
    category,
    difficulty,
    question,
    players,
    messages,
    answers,
    countdown,
    timeElapsed,
    isTimed,
    autoStart,
    timeLimit,
    allAnswered,
    selectedAnswerId,
    isHost,
    gameStarted,
    questionReady,
    drawing,
    languages,
    language,
    allReady,
    currentBackground,
    gameOver
  } = state;

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${currentBackground})`,
      borderRadius: '0px 0px 24px 24px',
      backgroundSize: 'cover',
      backgroundPosition: 'center 10%'
    }),
    [currentBackground]
  );

  const { t } = useTranslation();

  useEffect(() => {
    if (gameOver) {
      showModal(
        <GameOverCard
          gameId={gameId}
          won={false}
          score={12}
          onNavigate={hideModal}
        />,
        t('common.game_over')
      );
    }
  }, [gameOver, gameId]);

  if (isLoading) return <p>{t('common.loading')}</p>;

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={backgroundStyle}
      >
        {/* <span className="mask bg-gradient-dark opacity-6"></span> */}
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} className="text-center mx-auto">
              <h1 className="text-white mb-2 mt-10">{category.name}</h1>
              <p className="text-lead text-white">
                <span className="me-3">
                  <strong>{t('common.difficulty')}:</strong> {difficulty}/3
                </span>
                <span className="me-3">
                  <strong>{t('common.language')}:</strong> {language.name}
                </span>
                <span className="">
                  <strong>{t('common.game_mode')}: </strong>{' '}
                  {state.gameMode && state.gameMode.name}
                </span>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="mt-lg-n10 mt-md-n10 mt-n10">
          <Card>
            <Card.Body
              className="row z-index-1 d-flex flex-column flex-lg-row"
              style={{ borderBottom: '1px solid #eee' }}
            >
              <QuestionTimer
                show={questionReady && timeLimit > 0}
                elapsed={timeLimit - state.timer}
                timeLimit={timeLimit}
                isPlaying={true}
              />
              <Lifelines show={questionReady} className="ms-lg-8" />
              <Col
                sm={12}
                xs={12}
                lg={8}
                className="position-relative d-flex justify-content-center"
              >
                <FadeInOut
                  show={displayResult !== null}
                  duration={500}
                  className="position-absolute z-index-2 rounded-4 top-0 bottom-0 d-flex align-items-center justify-content-center mt-1"
                  style={{
                    left: '0px',
                    right: '0px',
                    background: 'rgba(255,255,255,0.9)'
                  }}
                >
                  <ResultBadge won={displayResult} />
                </FadeInOut>

                <FadeInOut
                  show={questionReady}
                  duration={500}
                  className="position-relative d-flex w-100"
                >
                  <QuestionCard
                    question={question}
                    answers={answers}
                    handleAnswerClicked={handleAnswerClicked}
                    selectedAnswerId={selectedAnswerId}
                    player_answers={
                      allAnswered
                        ? players
                            .map(
                              (player) =>
                                player.answer && {
                                  player: player.id,
                                  answer_id: player.answer
                                }
                            )
                            .filter(Boolean)
                        : []
                    }
                  />
                </FadeInOut>
                <FadeInOut
                  show={
                    !questionReady && (countdown.remaining_time > 0 || drawing)
                  }
                  duration={500}
                  className="position-relative align-items-center justify-content-center d-flex"
                  style={{
                    left: '0px',
                    right: '0px',
                    top: '0px',
                    bottom: '0px'
                  }}
                >
                  <Countdown
                    secondsLeft={countdown.remaining_time}
                    secondsTotal={drawing ? 1 : countdown.total_time}
                    title={null}
                    showProgressBar={true}
                  />
                </FadeInOut>
              </Col>
              <Col xs={12} sm={12} lg={4} className="mt-5 mt-lg-0">
                <Sidebar
                  players={players}
                  playerId={user.id}
                  messages={messages}
                  sendMessage={handleSendMessage}
                />
                {isTimed && <ProgressBar now={timeElapsed} max={timeLimit} />}
              </Col>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col size={12} className="d-flex flex-column flex-lg-row">
                  <Button
                    variant="none"
                    onClick={handleReady}
                    className={
                      'btn-sm btn-round mb-0 me-2 mt-2 mt-lg-0 ' +
                      (isReady(user)
                        ? 'disabled btn-success'
                        : 'btn-outline-success')
                    }
                  >
                    {t('game.ready')}
                  </Button>
                  {questionReady && (
                    <Button
                      variant="danger"
                      className="btn-sm btn-round mb-0 me-2 mt-2 mt-lg-0"
                      onClick={() =>
                        showModal(
                          <ReportQuestion
                            question={question}
                            onSubmit={hideModal}
                          />,
                          t('game.report_question')
                        )
                      }
                    >
                      {t('game.report_question')}
                    </Button>
                  )}
                  {isHost && !gameStarted && allReady && (
                    <Button
                      className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                      onClick={handleStartGame}
                    >
                      {t('game.start_game')}
                    </Button>
                  )}
                  {gameStarted && isHost && (
                    <>
                      {state.paused ? (
                        <Button
                          className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                          onClick={handleResumeGame}
                        >
                          {t('game.resume_game')}
                        </Button>
                      ) : (
                        <Button
                          className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                          onClick={handlePauseGame}
                        >
                          {t('game.pause_game')}
                        </Button>
                      )}

                      <Button
                        className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                        onClick={handleStopGame}
                      >
                        {t('game.stop_game')}
                      </Button>
                    </>
                  )}
                  {gameStarted && allAnswered && !autoStart && (
                    <Button
                      className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                      onClick={handleNextQuestionClick}
                    >
                      {t('game.next_question')}
                    </Button>
                  )}
                  {isHost &&
                    state.gameMode &&
                    state.gameMode.name === 'Custom' && (
                      <>
                        <Select
                          className="mx-2 flex-grow-1 mt-2 mt-lg-0"
                          options={categories}
                          value={{ label: category.name, value: category.id }}
                          onChange={handleCategoryChange}
                          onCreateOption={handleCategoryChange}
                          formatCreateLabel={(inputValue) =>
                            `Add "${inputValue}"`
                          }
                          isSearchable
                          isClearable
                        />
                        <Select
                          className="mx-2 flex-grow-1 mt-2 mt-lg-0"
                          options={difficultyOptions}
                          value={difficultyOptions[difficulty - 1]}
                          onChange={handleDifficultyChange}
                        />
                        <Select
                          className="mx-2 flex-grow-1 mt-2 mt-lg-0"
                          options={languages}
                          value={{
                            label: language.name,
                            value: language.iso_code
                          }}
                          onChange={handleLanguageChange}
                          isSearchable
                          defaultValue={{ label: 'English', value: 'en' }}
                        />
                      </>
                    )}
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Row>
      </Container>
    </section>
  );
};

export default GameUI;
