import { MutationPayload, Post, Profile } from "../../models/interfaces";
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
  if (!userId) throw new Error();
  let { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();

  return data;
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

  if (error) {
    console.log(error);
  }

  return error ? error : data;
};

export const updateProfiles = async (payload: Profile[]) => {
  let { error, data } = await supabase.from("profiles").upsert(payload);

  return error ? error : data;
};

export const getPosts = async () => {
  let { error, data } = await supabase.from("posts").select("*, profiles(*)");

  return error ? error : (data as unknown as Post[]);
};

export const createPost = async (payload: any) => {
  let { error, data } = await supabase.from("posts").insert(payload.body);

  if (error) {
    console.log(error);
    throw new Error();
  }

  return data;
};

export const updatePost = async (payload: any) => {
  let { error, data } = await supabase
    .from("posts")
    .update(payload.body)
    .eq("id", payload.id)
    .select("*, profiles(*)")
    .single();

  if (error) {
    console.log(error);
    throw new Error();
  }

  return data;
};
export const deletePost = async (payload: MutationPayload) => {
  const { error, data } = await supabase
    .from("posts")
    .delete()
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw new Error();
  }

  return data;
};

export const handlePostMutation = async (payload: MutationPayload) => {
  switch (payload.option) {
    case "create":
      createPost(payload);
      break;

    case "update":
      updatePost(payload);
      break;

    case "delete":
      deletePost(payload);
      break;

    default:
      break;
  }
};
