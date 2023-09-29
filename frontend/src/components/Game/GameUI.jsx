import React, { useMemo } from 'react';
import {
  Button,
  Col,
  Container,
  ProgressBar,
  Row,
  Card
} from 'react-bootstrap';
import Select from 'react-select';
import Countdown from './Countdown';
import QuestionCard from './QuestionCard';
import Sidebar from './SideBar';
import FadeInOut from '../shared/FadeInOut';
import ResultBadge from './ResultBadge';
import Lifelines from './LifeLines';

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
  showModal,
  hideModal,
  user,
  isLoading
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
    currentBackground
  } = state;

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${currentBackground})`,
      borderRadius: '0px 0px 24px 24px',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }),
    [currentBackground]
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={backgroundStyle}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <Container>
          <Row className="justify-content-center">
            <Col lg={5} className="text-center mx-auto">
              <h1 className="text-white mb-2 mt-10">{category.name}</h1>
              <p className="text-lead text-white">
                Current difficulty: {difficulty}/5
              </p>
              <p className="text-lead text-white">
                Current language: {language.name}
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="mt-lg-n10 mt-md-n10 mt-n10">
          <Card>
            <FadeInOut
              show={displayResult !== null}
              duration={500}
              className="position-relative z-index-2 rounded-4 top-0 bottom-0 d-flex align-items-center justify-content-center"
              style={{
                left: '0px',
                right: '0px',
                background: 'rgba(255,255,255,0.9)'
              }}
            >
              <ResultBadge won={displayResult} />
            </FadeInOut>
            <Card.Body
              className="row z-index-1 d-flex flex-column flex-lg-row"
              style={{ borderBottom: '1px solid #eee' }}
            >
              <Lifelines show={questionReady} />
              <Col
                sm={12}
                xs={12}
                lg={8}
                className="position-relative d-flex justify-content-center"
              >
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
                    Ready
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
                          'Report Question'
                        )
                      }
                    >
                      Report question
                    </Button>
                  )}
                  {isHost && !gameStarted && allReady && (
                    <Button
                      className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                      onClick={handleStartGame}
                    >
                      Start Game
                    </Button>
                  )}
                  {gameStarted && isHost && (
                    <Button className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0">
                      Stop Game
                    </Button>
                  )}
                  {gameStarted && allAnswered && !autoStart && (
                    <Button
                      className="btn-sm btn-round mb-0 me-3 mt-2 mt-lg-0"
                      onClick={handleNextQuestionClick}
                    >
                      Next question
                    </Button>
                  )}
                  {isHost && (
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
