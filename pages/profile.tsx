import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { GiBrazilFlag } from "react-icons/gi";
import { MdArrowBackIos } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import { useAuthContext } from "../src/context/index";
import { supabase } from "../utils/supabaseClient";

const Account: NextPage = () => {
  const { user, setUser, setProfiles } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();

  return (
    <div className="font-kanit pb-14">
      <header className="w-full">
        <div className="pl-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-gray-100 duration-200 hover:text-warning flex items-center justify-center"
          >
            <MdArrowBackIos className="lg:text-xl" />
            <p className="font-thin">VOLTAR</p>
          </button>
          <button
            className="btn btn-ghost text-red-400 lg:btn-md gap-2"
            onClick={() => {
              supabase.auth.signOut();
              router.push("/login");
              setUser(null);
              setProfiles([]);
            }}
          >
            SAIR
            <VscSignOut className="" />
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
        <article className="w-2/3 m-auto">
          <ul className="flex justify-between items-center">
            <li className="w-fit font-thin p-1 text-xs rounded-md">
              {user?.followers.length} SEGUIDORES
            </li>
            <li className="divider divider-horizontal"></li>
            <li className="w-fit font-thin p-1 text-xs rounded-md">
              SEGUINDO {user?.following.length}
            </li>
          </ul>
        </article>
      </header>
      <main className="mt-5 px-1 lg:mt-10 lg:px-5 w-full">
        <section>
          <h1 className="ml-2 lg:ml-0 text-2xl font-thin lg:text-left lg:text-3xl text-danube">
            ÁLBUNS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-2">
              {user?.albums.map((album, index) => (
                <li
                  key={index}
                  className="bg-dark-600 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32"
                >
                  <figure className="">
                    <img
                      src={album.cover.md}
                      alt={album.name}
                      className="h-32 lg:h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2
                      className={`text-gray-100 ${
                        album.name.length > 20 && "text-xs"
                      }`}
                    >
                      {album.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {album.artist.map((artist, index) => (
                        <span key={index}>{artist}</span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <section className="mt-10 px-1">
          <h1 className="ml-2 lg:ml-0 font-thin text-2xl lg:text-left lg:text-3xl text-danube">
            MÚSICAS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md">
            <ul className="carousel gap-2">
              {user?.musics.map((music, index) => (
                <li
                  key={index}
                  className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32"
                >
                  <figure>
                    <img
                      src={music.cover.md}
                      alt={music.name}
                      className="h-32 lg:h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2
                      className={`text-gray-100 ${
                        music.name.length > 20 && "text-xs"
                      }`}
                    >
                      {music.name}
                    </h2>
                    <p
                      className={`text-sm text-gray-400 ${
                        music.artist.length > 1 && "text-xs"
                      }`}
                    >
                      {music.artist.map((artist, index) => (
                        <span key={index}>{artist}</span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
      <div className=""></div>
    </div>
  );
};

export default Account;
