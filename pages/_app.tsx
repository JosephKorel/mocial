import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import ContextProvider from "../src/context";
import { BottomNav } from "../src/components/BottomNav";
import { Alert } from "../src/components/Alert";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Kanit:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/*  <nav className="prose">
        {authenticaded ? <h1>Autenticado</h1> : <h1>Não Autenticado</h1>}
      </nav> */}
      <ContextProvider>
        <Component {...pageProps} />
        <BottomNav />
      </ContextProvider>
    </>
  );
}

export default MyApp;
