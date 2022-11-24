import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../../models/interfaces";
import {
  getProfiles,
  getUser,
  updateUser,
  ProfilePayload,
  updateProfiles,
  getAccessToken,
  userUpdate,
  UpdatePayload,
} from "../../pages/api/query-tools";
import { queryClient } from "../../pages/_app";

interface QueryData {
  user: Profile;
  profiles: Profile[];
}

export const useToken = (): string => {
  const { data, isLoading } = useQuery(["access_token"], getAccessToken);

  return data;
};

export const getSongs = async (text: string, token: string) => {
  const parameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const onFetch = await fetch(
    `https://api.spotify.com/v1/search?q=${text}&type=track&limit=10`,
    parameters
  );

  const data = await onFetch.json();

  console.log(data);

  return data.tracks.items;
};

export const getAlbums = async (text: string, token: string) => {
  const parameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const onFetch = await fetch(
    `https://api.spotify.com/v1/search?q=${text}&type=album&limit=10`,
    parameters
  );

  const data = await onFetch.json();

  return data.albums.items;
};

export const useSongs = (text: string, token: string) => {
  return useQuery(["songs", text], () => getSongs(text, token), {
    keepPreviousData: true,
  });
};

export const useAlbums = (text: string, token: string) => {
  return useQuery(["albums", text], () => getAlbums(text, token), {
    keepPreviousData: true,
  });
};

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

export const useUserUpdate = () => {
  return useMutation((payload: UpdatePayload) => userUpdate(payload), {
    onSuccess: () => queryClient.invalidateQueries(["profiles"]),
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
