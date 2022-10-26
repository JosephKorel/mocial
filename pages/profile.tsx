import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { CgArrowLeft } from "react-icons/cg";
import { MdArrowBackIos } from "react-icons/md";
import { Profile } from "../models/interfaces";
import { useAuthContext } from "../src/context/index";
import { supabase } from "../utils/supabaseClient";

const Account: NextPage = () => {
  const { user, setUser } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();

  return (
    <div className="font-kanit">
      <header className="w-full">
        <div className="py-2 px-5">
          <button
            onClick={() => router.back()}
            className="text-gray-100 duration-200 hover:text-warning flex items-center justify-center"
          >
            <MdArrowBackIos className="lg:text-xl" />
            <p className="font-thin">VOLTAR</p>
          </button>
        </div>
        <div className="flex flex-col items-center gap-0">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={user?.avatar_url}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className=""
              ></img>
            </div>
          </div>
          <h2 className="text-gray-100 text-lg font-light">{user?.username}</h2>
        </div>
      </header>
      <main className="mt-5 px-1 lg:mt-10 lg:px-5 w-full">
        <section>
          <h1 className="ml-2 lg:ml-0 text-xl lg:text-left lg:text-3xl text-warning font-cinzel">
            álbuns
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-2">
              {user?.albums.map((album) => (
                <li className="bg-dark-600 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32">
                  <figure className="">
                    <img
                      src={album.cover.md}
                      alt={album.name}
                      className="h-32 lg:h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2
                      className={`text-warning ${
                        album.name.length > 20 && "text-xs"
                      }`}
                    >
                      {album.name}
                    </h2>
                    <p className="text-sm">
                      {album.artist.map((artist) => artist)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <section className="mt-10 px-1">
          <h1 className="ml-2 lg:ml-0 text-xl lg:text-left lg:text-3xl text-warning font-cinzel">
            músicas
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md">
            <ul className="carousel gap-2">
              {user?.musics.map((music) => (
                <li className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32">
                  <figure>
                    <img
                      src={music.cover.md}
                      alt={music.name}
                      className="h-32 lg:h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2
                      className={`text-warning ${
                        music.name.length > 20 && "text-xs"
                      }`}
                    >
                      {music.name}
                    </h2>
                    <p
                      className={`text-sm ${
                        music.artist.length > 1 && "text-xs"
                      }`}
                    >
                      {music.artist.map((artist) => artist)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
      <div>
        <button
          className="btn btn-warning"
          onClick={() => supabase.auth.signOut()}
        >
          SAIR
        </button>
      </div>
    </div>
  );
};

export default Account;
