import React, { useState, ReactNode, useContext, createContext } from "react";
import { ContextType } from "../../models/context-type";

const ContextDefaultValues = {
  success: "",
  setSuccess: () => {},
  error: "",
  setError: () => {},
  element: null,
  setElement: () => {},
  notification: null,
  setNotification: () => {},
};

const AuthContext = createContext<ContextType>(ContextDefaultValues);

export function useAuthContext() {
  return useContext(AuthContext);
}

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [element, setElement] = useState<JSX.Element | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<JSX.Element | null>(null);

  const value: ContextType = {
    element,
    setElement,
    success,
    setSuccess,
    error,
    setError,
    notification,
    setNotification,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default ContextProvider;
