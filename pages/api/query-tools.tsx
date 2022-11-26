import { Post, Profile } from "../../models/interfaces";
import { supabase } from "../../utils/supabaseClient";
import { Music, Albums } from "../../models/interfaces";
import { PostgrestError } from "@supabase/supabase-js";
import { queryClient } from "../_app";

export interface ProfilePayload {
  id: string;
  avatar_url?: string;
  genres?: string[];
  musics?: Music[];
  albums?: Albums[];
  following?: string[];
  followers?: string[];
  updated_at?: Date;
  background?: string;
}

export interface UpdatePayload {
  id: string;
  body: any;
}

export const getAccessToken = async () => {
  const parameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
  };
  const onFetch = await fetch(
    "https://accounts.spotify.com/api/token",
    parameters
  );

  const data = await onFetch.json();

  return data.access_token;
};

export const getProfiles = async (): Promise<Profile[] | null> => {
  let { data } = await supabase.from("profiles").select();
  return data;
};

export const getUser = async (): Promise<Profile | PostgrestError | null> => {
  const onFetch = await supabase.auth.getUser();
  const userId = onFetch.data.user?.id;
  let { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();

  return data ? data : error;
};

export const updateUser = async (payload: ProfilePayload) => {
  let { error, data } = await supabase.from("profiles").upsert(payload);

  return error ? error : data;
};

export const userUpdate = async (payload: UpdatePayload) => {
  const { error, data } = await supabase
    .from("profiles")
    .update(payload.body)
    .eq("id", payload.id);

  return error ? error : data;
};

export const updateProfiles = async (payload: Profile[]) => {
  let { error, data } = await supabase.from("profiles").upsert(payload);

  return error ? error : data;
};

export const getPosts = async () => {
  let { error, data } = await supabase.from("posts").select();

  return error ? error : (data as unknown as Post[]);
};

export const createPost = async (payload: any) => {
  let { error, data } = await supabase.from("posts").insert(payload);
  queryClient.invalidateQueries(["posts"]);

  return error ? error : data;
};
