import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { HomePageProps, Profile } from "../models/interfaces";
import { useQuery } from "@tanstack/react-query";
import { getProfiles, getUser } from "./api/query-tools";
import { useNotifications, usePosts, useUser } from "../utils/Hooks";

const InitialPage: NextPage<HomePageProps> = ({ profiles }) => {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
    initialData: profiles,
  });
  const { data: currentUser, isLoading } = useUser();
  const user = currentUser as Profile;
  const {} = usePosts();
  const {} = useNotifications(isLoading ? undefined : user.id);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        if (session) {
          const hasDocument = (await checkUser()) ? true : false;
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

  const checkUser = async () => {
    const hasData = await getUser();
    if (hasData) {
      return true;
    } else return false;
  };

  return <div></div>;
};

export default InitialPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const profiles = await getProfiles();
  const id = await supabase.auth.getUser();

  return {
    props: { profiles },
  };
};
