import React, { createContext, useState, useCallback, useContext } from 'react';

const PromptContext = createContext();

const PromptProvider = ({ children }) => {
  const [prompt, setPrompt] = useState({
    show: false,
    message: '',
    onApprove: () => {},
    onDecline: () => {},
    onCancel: () => {}
  });

  const showPrompt = useCallback((message, onApprove, onDecline, onCancel) => {
    setPrompt({
      show: true,
      message,
      onApprove: () => {
        onApprove();
        setPrompt((prev) => ({ ...prev, show: false }));
      },
      onDecline: () => {
        onDecline();
        setPrompt((prev) => ({ ...prev, show: false }));
      },
      onCancel: () => {
        onCancel();
        setPrompt((prev) => ({ ...prev, show: false }));
      }
    });
  }, []);

  const hidePrompt = useCallback(() => {
    setPrompt((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <PromptContext.Provider value={{ prompt, showPrompt, hidePrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

export { usePrompt, PromptProvider };
