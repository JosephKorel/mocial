import { Profile } from "../../models/interfaces";
import { supabase } from "../../utils/supabaseClient";
import { Music, Albums } from "../../models/interfaces";
import { PostgrestError } from "@supabase/supabase-js";

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

export const getProfiles = async (): Promise<Profile[] | null> => {
  let { data, error } = await supabase.from("profiles").select();
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
  console.log(payload);
  let { error, data } = await supabase.from("profiles").upsert(payload);

  return error ? error : data;
};
