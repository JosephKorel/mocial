import { Profile } from "./interfaces";

export type ContextType = {
  success: string;
  setSuccess: (data: string) => void;
  error: string;
  setError: (data: string) => void;
  element: JSX.Element;
  setElement: (data: JSX.Element) => void;
};
