import { Profile } from "./interfaces";

export type ContextType = {
  success: string;
  setSuccess: (data: string) => void;
  error: string;
  setError: (data: string) => void;
  element: JSX.Element | null;
  setElement: (data: JSX.Element | null) => void;
  notification: JSX.Element | null;
  setNotification: (data: JSX.Element | null) => void;
};
