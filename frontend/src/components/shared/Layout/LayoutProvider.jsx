import React from 'react';
import { AlertProvider } from '../Alert/AlertContext';
import { PromptProvider } from '../Prompt/PromptContext';
import { ModalProvider } from '../Modal/ModalContext';

const LayoutProvider = ({ children }) => {
  return (
    <AlertProvider>
      <ModalProvider>
        <PromptProvider>{children}</PromptProvider>
      </ModalProvider>
    </AlertProvider>
  );
};

export default LayoutProvider;
