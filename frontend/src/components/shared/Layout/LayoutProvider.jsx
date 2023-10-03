import React from 'react';
import { AlertProvider } from '../Alert/AlertContext';
import { PromptProvider } from '../Prompt/PromptContext';
import { ModalProvider } from '../Modal/ModalContext';
import { TranslationProvider } from '../Translation/TranslationProvider';

const LayoutProvider = ({ children }) => {
  return (
    <TranslationProvider>
      <AlertProvider>
        <ModalProvider>
          <PromptProvider>{children}</PromptProvider>
        </ModalProvider>
      </AlertProvider>
    </TranslationProvider>
  );
};

export default LayoutProvider;
