import React, { createContext, useState, useCallback, useContext } from 'react';
import { GameOverlay } from './GameOverlay';

const GameOverlayContext = createContext();

const GameOverlayProvider = ({ children }) => {
  const [overlay, setOverlay] = useState({
    show: false,
    content: null,
    onClose: () => {}
  });

  const showOverlay = useCallback((content, onClose = () => {}) => {
    setOverlay({
      show: true,
      content,
      onClose: () => {
        onClose();
        setOverlay((prev) => ({ ...prev, show: false }));
      }
    });
  }, []);

  const hideOverlay = useCallback(() => {
    setOverlay((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <GameOverlayContext.Provider value={{ overlay, showOverlay, hideOverlay }}>
      {children}
      {overlay && <GameOverlay {...overlay} />}
    </GameOverlayContext.Provider>
  );
};

const useGameOverlay = () => {
  const context = useContext(GameOverlayContext);
  if (context === undefined) {
    throw new Error('useGameOverlay must be used within a GameOverlayProvider');
  }
  return context;
};

export { useGameOverlay, GameOverlayProvider };
