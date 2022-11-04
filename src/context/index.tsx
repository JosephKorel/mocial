import React, { useState, ReactNode, useContext, createContext } from "react";
import { ContextType } from "../../models/context-type";
import { Profile } from "../../models/interfaces";

const ContextDefaultValues = {
  user: null,
  setUser: () => {},
  profiles: [],
  setProfiles: () => {},
  success: "",
  setSuccess: () => {},
  error: "",
  setError: () => {},
};

const AuthContext = createContext<ContextType>(ContextDefaultValues);

export function useAuthContext() {
  return useContext(AuthContext);
}

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const value: ContextType = {
    user,
    setUser,
    profiles,
    setProfiles,
    success,
    setSuccess,
    error,
    setError,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default ContextProvider;
