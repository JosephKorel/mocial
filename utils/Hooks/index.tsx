import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../../models/interfaces";
import {
  getProfiles,
  getUser,
  updateUser,
  ProfilePayload,
} from "../../pages/api/query-tools";
import { queryClient } from "../../pages/_app";
import { supabase } from "../supabaseClient";

export const useUser = () => {
  return useQuery({ queryKey: ["user"], queryFn: getUser });
};

export const userUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: ProfilePayload) => updateUser(payload), {
    onSuccess: () => queryClient.invalidateQueries(["user"]),
  });
};

export const useProfiles = () => {
  return useQuery(["profiles"], () => getProfiles());
};
