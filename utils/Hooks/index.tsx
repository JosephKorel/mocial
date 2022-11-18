import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../../models/interfaces";
import {
  getProfiles,
  getUser,
  updateUser,
  ProfilePayload,
  updateProfiles,
} from "../../pages/api/query-tools";
import { queryClient } from "../../pages/_app";

interface QueryData {
  user: Profile;
  profiles: Profile[];
}

export const useProfiles = () => {
  return useQuery(["profiles"], getProfiles);
};

export const useUser = () => {
  return useQuery(["user"], getUser);
};

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: ProfilePayload) => updateUser(payload), {
    onSuccess: () => queryClient.invalidateQueries(["user"]),
  });
};

export const useProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: Profile[]) => updateProfiles(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useQueryData = (keys: string[]): QueryData => {
  let data = {} as QueryData;
  keys.forEach((key) => {
    const keyData = queryClient.getQueryData([key]);
    data = { ...data, [key]: keyData };
  });

  return data;
};
