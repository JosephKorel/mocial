import { Profile } from "./interfaces";

export type ContextType = {
  user: Profile | null;
  setUser: (data: Profile | null) => void;
};
