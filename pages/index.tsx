import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { HomePageProps } from "../models/interfaces";
import { useQuery } from "@tanstack/react-query";
import { getProfiles, getUser } from "./api/query-tools";
import { useUser } from "../utils/Hooks";

const InitialPage: NextPage<HomePageProps> = ({ profiles }) => {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
    initialData: profiles,
  });
  const {} = useUser();

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

  return {
    props: { profiles },
  };
};
