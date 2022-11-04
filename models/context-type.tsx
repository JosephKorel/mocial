import { Profile } from "./interfaces";

export type ContextType = {
  user: Profile | null;
  setUser: (data: Profile | null) => void;
  profiles: Profile[];
  setProfiles: (data: Profile[]) => void;
  success: string;
  setSuccess: (data: string) => void;
  error: string;
  setError: (data: string) => void;
};
