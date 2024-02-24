import React from 'react';
import { ResumeGameButton } from './ResumeGameButton';
import { PauseGameButton } from './PauseGameButton';
import { StopGameButton } from './StopGameButton';
import { LanguageSelect } from './LanguageSelect';

const renderCustomizeGameControls = (
  handleLanguageChange,
  languages,
  language
) => {
  return (
    <>
      {/* <CategorySelect
                categories={props.categories}
                category={props.category}
                handleCategoryChange={props.handleCategoryChange}
            /> */}
      {/* <DifficultySelect
                difficultyOptions={props.difficultyOptions}
                difficulty={props.difficulty}
                handleDifficultyChange={props.handleDifficultyChange}
            /> */}
      <LanguageSelect
        languages={languages}
        language={language}
        handleLanguageChange={handleLanguageChange}
      />
    </>
  );
};

const renderInGameHostControls = (
  paused,
  handlePauseGame,
  handleResumeGame
) => {
  return (
    <>
      {paused ? (
        <ResumeGameButton handlePauseGame={handlePauseGame} />
      ) : (
        <PauseGameButton handleResumeGame={handleResumeGame} />
      )}
      <StopGameButton />
    </>
  );
};

export const HostControls = ({
  paused,
  handlePauseGame,
  gameModeName,
  gameStarted,
  allReady,
  languages,
  language,
  handleResumeGame,
  handleStopGame,
  handleStartGame
}) => {
  return (
    <>
      {!gameStarted && allReady && (
        <StartGameButton handleStartGame={handleStartGame} />
      )}
      {gameStarted &&
        renderInGameHostControls(paused, handlePauseGame, handleResumeGame)}
      {gameModeName === 'Custom' &&
        renderCustomizeGameControls(handleLanguageChange, languages, language)}
    </>
  );
};

HostControls.propTypes = {
  paused: PropTypes.bool,
  gameStarted: PropTypes.bool,
  allReady: PropTypes.bool,
  gameModeName: PropTypes.string,
  languages: PropTypes.array,
  language: PropTypes.string,
  handlePauseGame: PropTypes.func,
  handleResumeGame: PropTypes.func,
  handleStartGame: PropTypes.func,
  handleStopGame: PropTypes.func,
  handleLangugageChange: PropTypes.func
};
