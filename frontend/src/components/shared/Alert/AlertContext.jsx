import React, { createContext, useState, useCallback, useContext } from 'react';
import Alert from './Alert';

const AlertContext = createContext();

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((title, message, details, options) => {
    setAlert({ message, title, details, ...options });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      {alert && <Alert {...alert} onClose={hideAlert} />}
    </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export { AlertContext, AlertProvider, useAlert };
