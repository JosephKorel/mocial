import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [authenticaded, setAuthenticaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        if (session) {
          setAuthenticaded(true);
          const id = session?.user.id;
          const hasDocument = (await checkUser(id!)) ? true : false;
          hasDocument
            ? router.push({
                pathname: "/[id]",
                query: { id: id },
              })
            : router.push("/new-user");
        } else router.push("/login");
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event == "SIGNED_IN") {
        setAuthenticaded(true);
        const id = session?.user.id;
        const hasDocument = (await checkUser(id!)) ? true : false;
        hasDocument
          ? router.push({
              pathname: "/[id]",
              query: { id: id },
            })
          : router.push("/new-user");
      } else {
        setAuthenticaded(false);
        router.push("/login");
      }
    });

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async (id: string) => {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`username`)
      .eq("id", id)
      .single();
    return data ? true : false;
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/*  <nav className="prose">
        {authenticaded ? <h1>Autenticado</h1> : <h1>Não Autenticado</h1>}
      </nav> */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
