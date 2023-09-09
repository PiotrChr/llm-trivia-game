import React, { createContext, useState, useCallback, useContext } from 'react';
import Modal from './Modal';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    show: false,
    content: null,
    onClose: () => {},
    title: '',
    showFooter: false,
    footerButtons: []
  });

  const showModal = useCallback(
    (
      content,
      title,
      onClose = () => {},
      showFooter = false,
      footerButtons = []
    ) => {
      setModal({
        show: true,
        content,
        title,
        footerButtons,
        showFooter,
        onClose: () => {
          onClose();
          setModal((prev) => ({ ...prev, show: false }));
        }
      });
    },
    []
  );

  const hideModal = useCallback(() => {
    setModal((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
      {modal && <Modal {...modal} />}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export { useModal, ModalProvider };
