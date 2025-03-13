// client/src/context/UIContext.js
import React, { createContext, useContext } from 'react';
import useToast from '../hooks/useToast'; // Import the hook

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const { toast, showToast } = useToast();

  return (
    <UIContext.Provider value={{ toast, showToast }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  return useContext(UIContext);
};