import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { useAuthContext } from "../src/context";
import { HomePageProps, Profile } from "../models/interfaces";

const InitialPage: NextPage<HomePageProps> = ({ profiles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setUser, setProfiles } = useAuthContext();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        if (session) {
          const id = session?.user.id;
          const hasDocument = (await checkUser(id!)) ? true : false;
          hasDocument
            ? router.push({
                pathname: "/home",
              })
            : router.push("/new-user");
        } else router.push("/login");
      }
    }

    getInitialSession();
  }, []);

  const checkUser = async (id: string) => {
    let { data, error, status } = await supabase
      .from("profiles")
      .select()
      .eq("id", id)
      .single();

    if (data) {
      setProfiles(profiles);
      setUser(data);
      return true;
    } else return false;
  };

  return <div></div>;
};

export default InitialPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const getProfiles = async () => {
    let { data, error, status } = await supabase.from("profiles").select();

    return data as Profile[];
  };

  const profiles = await getProfiles();

  return {
    props: { profiles },
  };
};
