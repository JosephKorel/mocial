import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { GiBrazilFlag } from "react-icons/gi";
import { MdArrowBackIos } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import { useAuthContext } from "../src/context/index";
import { supabase } from "../utils/supabaseClient";
import { Profile } from "../models/interfaces";

const Profile: NextPage = () => {
  const { user, profiles, setProfiles } = useAuthContext();
  const [target, setTarget] = useState<Profile>();
  const router = useRouter();

  const { seeUser } = router.query as { seeUser: string };
  const id = seeUser;

  useEffect(() => {
    const getUser = profiles.filter((item) => item.id == id);
    setTarget(getUser[0]);
  }, []);

  return (
    <div
      className={`font-kanit pt-2 w-full h-56 bg-no-repeat bg-cover`}
      style={{ backgroundImage: `url("${target?.albums[2].cover.lg}")` }}
    >
      <div className="pl-4 relative z-10">
        <button
          onClick={() => router.back()}
          className="text-gray-100 bg-dark p-1 text-sm rounded-md duration-200 hover:text-warning flex items-center justify-center"
        >
          <MdArrowBackIos className="lg:text-xl" />
          <p className="font-thin">VOLTAR</p>
        </button>
      </div>
      <header className="mt-20 w-full relative z-10 mybg">
        <div className="flex flex-col items-center gap-0">
          <div className="avatar ">
            <div className="w-12 rounded-full">
              <img
                src={target?.avatar_url}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className=""
              ></img>
            </div>
          </div>
          <h2 className="text-gray-100 text-lg font-light">
            {target?.username}
          </h2>
        </div>
        <article className="w-full ">
          <ul className="w-2/3 m-auto flex justify-between items-center">
            <li className="w-fit font-thin p-1 text-xs rounded-md">
              {target?.followers.length} SEGUIDORES
            </li>
            <li className="divider divider-horizontal"></li>
            <li className="w-fit font-thin p-1 text-xs rounded-md">
              SEGUINDO {target?.following.length}
            </li>
          </ul>
        </article>
      </header>
      <main className=" px-1 lg:mt-10 lg:px-5 w-full relative z-10 bg-dark-600">
        <section>
          <h1 className="ml-2 lg:ml-0 text-2xl font-thin lg:text-left lg:text-3xl text-danube">
            ÁLBUNS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-2">
              {target?.albums.map((album, index) => (
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
                      className={`text-gray-100  ${
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
            <ul className="carousel gap-4">
              {target?.musics.map((music, index) => (
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
                      className={`text-sm text-gray-400 break-words ${
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

export default Profile;
