import React, { useEffect, useMemo } from 'react';
import {
  Col,
  Container,
  ProgressBar,
  Row,
  Card,
} from 'react-bootstrap';
import Countdown from './Countdown';
import QuestionCard from './QuestionCard';
import Sidebar from './SideBar';
import FadeInOut from '../shared/FadeInOut';
import ResultBadge from './ResultBadge';
import Lifelines from './LifeLines';
import QuestionTimer from './QuestionTimer';
import { useTranslation } from 'react-i18next';
import { GameOverCard } from './GameOverCard';
import { GameControls } from './GameControls';

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
  handleLifelineSelected,
  showModal,
  hideModal,
  user,
  isLoading,
  gameId
}) => {
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${state.currentBackground})`,
      borderRadius: '0px 0px 24px 24px',
      backgroundSize: 'cover',
      backgroundPosition: 'center 10%'
    }),
    [state.currentBackground]
  );

  const { t } = useTranslation();

  useEffect(() => {
    if (state.gameOver) {
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
  }, [state.gameOver, gameId]);

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
              <h1 className="text-white mb-2 mt-10">{state.category.name}</h1>
              <p className="text-lead text-white">
                <span className="me-3">
                  <strong>{t('common.difficulty')}:</strong> {state.difficulty}/3
                </span>
                <span className="me-3">
                  <strong>{t('common.language')}:</strong> {state.language.name}
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
                disabled={!state.questionReady || !state.isTimed}
                show={state.questionReady}
                elapsed={state.timeLimit - state.timer}
                timeLimit={state.timeLimit}
                isPlaying={true}
              />
              <Lifelines
                show={state.questionReady}
                className="ms-lg-8"
                lifelines={state.lifelines}
                onLifelineSelected={handleLifelineSelected}
              />
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
                  show={state.questionReady}
                  duration={500}
                  className="position-relative d-flex w-100"
                >
                  <QuestionCard
                    question={state.question}
                    answers={state.answers}
                    handleAnswerClicked={handleAnswerClicked}
                    selectedAnswerId={state.selectedAnswerId}
                    player_answers={
                      state.allAnswered
                        ? state.players
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
                    !state.questionReady && (state.countdown.remaining_time > 0 || state.drawing)
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
                    secondsLeft={state.countdown.remaining_time}
                    secondsTotal={state.drawing ? 1 : state.countdown.total_time}
                    title={null}
                    showProgressBar={true}
                  />
                </FadeInOut>
              </Col>
              <Col xs={12} sm={12} lg={4} className="mt-5 mt-lg-0">
                <Sidebar
                  players={state.players}
                  playerId={user.id}
                  messages={state.messages}
                  sendMessage={handleSendMessage}
                />
                {state.isTimed && <ProgressBar now={state.timeElapsed} max={state.timeLimit} />}
              </Col>
            </Card.Body>
            <Card.Footer>
              <GameControls
                handleReady={handleReady}
                handleStartGame={handleStartGame}
                handleResumeGame={handleResumeGame}
                handlePauseGame={handlePauseGame}
                handleStopGame={handleStopGame}
                handleNextQuestionClick={handleNextQuestionClick}
                handleCategoryChange={handleCategoryChange}
                handleDifficultyChange={handleDifficultyChange}
                handleLanguageChange={handleLanguageChange}
                questionReady={state.questionReady}
                question={state.question}
                onReport={hideModal}
                user={user}
                isHost={state.isHost}
                gameStarted={state.gameStarted}
                allReady={state.allReady}
                isReady={isReady}
                allAnswered={state.allAnswered}
                paused={state.paused}
                autoStart={state.autoStart}
                languages={state.languages}
                language={state.language}
                gameMode={state.gameMode}
                categories={categories}
                category={state.category}
                difficulty={state.difficulty}
                difficultyOptions={difficultyOptions}
              />
            </Card.Footer>
          </Card>
        </Row>
      </Container>
    </section>
  );
};

export default GameUI;
