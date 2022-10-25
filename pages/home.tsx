import { Session } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Account from "./new-user";
import Auth from "./login";
import NewUser from "./new-user";
import { useRouter } from "next/router";
import { useAuthContext } from "../src/context";
import { AccountProps, Profile } from "../models/interfaces";

const Home: NextPage<AccountProps> = ({ profile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<null | Session>(null);
  const router = useRouter();
  const { user, setUser } = useAuthContext();

  useEffect(() => {
    setUser(profile);
  }, []);

  return (
    <div>
      <header>
        <nav>
          <div className="flex justify-end items-center">
            <img src={user?.avatar_url} className="rounded-full w-20"></img>
            <p>{user?.username}</p>
          </div>
        </nav>
      </header>
      <main className="prose"></main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query as { id: string };

  const getUser = async () => {
    let { data, error, status } = await supabase
      .from("profiles")
      .select()
      .eq("id", id)
      .single();
    return data as Profile;
  };

  const data = await getUser();

  return {
    props: { profile: data },
  };
};
