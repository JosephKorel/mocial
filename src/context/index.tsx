import React, { useState, ReactNode, useContext, createContext } from "react";
import { ContextType } from "../../models/context-type";
import { Profile } from "../../models/interfaces";

const ContextDefaultValues = {
  success: "",
  setSuccess: () => {},
  error: "",
  setError: () => {},
  element: <></>,
  setElement: () => {},
};

const AuthContext = createContext<ContextType>(ContextDefaultValues);

export function useAuthContext() {
  return useContext(AuthContext);
}

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [element, setElement] = useState(<></>);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const value: ContextType = {
    element,
    setElement,
    success,
    setSuccess,
    error,
    setError,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default ContextProvider;
