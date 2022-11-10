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
import { FollowerFollowing } from "../src/components/Profile/Modal";
import { FaPeopleArrows } from "react-icons/fa";
import { BsArrowLeftRight, BsBoxArrowInUpRight } from "react-icons/bs";

const Profile: NextPage = () => {
  const { user, profiles, setUser } = useAuthContext();
  const [target, setTarget] = useState<Profile>();
  const [seeing, setSeeing] = useState("");
  const router = useRouter();
  const background = target?.background
    ? target.background
    : target?.albums[0].cover.lg;
  const isFollowing = target ? user!.following.includes(target.id) : false;

  const { seeUser } = router.query as { seeUser: string };
  const id = seeUser;

  useEffect(() => {
    const getUser = profiles.filter((item) => item.id == id);
    setTarget(getUser[0]);
  }, []);

  const followers = (): Profile[] => {
    if (!target) return [];

    const getProfiles = target.followers.reduce((acc, curr) => {
      const filter = profiles.filter((item) => item.id == curr);
      acc.push(filter[0]);
      return acc;
    }, [] as Profile[]);

    return getProfiles;
  };

  const following = (): Profile[] => {
    if (!target) return [];

    const getProfiles = target.following.reduce((acc, curr) => {
      const filter = profiles.filter((item) => item.id == curr);
      acc.push(filter[0]);
      return acc;
    }, [] as Profile[]);

    return getProfiles;
  };

  const handleFollow = async (): Promise<void> => {
    //Info do usuário
    let following = user!.following;
    const isFollowing = user!.following.includes(target!.id);

    //Info do visitado
    let targetFollowers = target?.followers;

    if (isFollowing) {
      const onFilter = following.filter((item) => item != target!.id);
      const onFollowerFilter = targetFollowers?.filter(
        (item) => item != user?.id
      );
      try {
        //Atualiza no perfil do usuário
        await supabase
          .from("profiles")
          .update({ following: onFilter })
          .eq("id", user?.id);

        //Atualiza no perfil do visitado
        await supabase
          .from("profiles")
          .update({ followers: onFollowerFilter })
          .eq("id", target!.id);

        //Atualiza no front o perfil do usuário
        setUser({ ...user!, following: onFilter });

        //Atualiza no front o perfil do visitado
        setTarget({ ...target!, followers: onFollowerFilter! });
      } catch (error: any) {
        alert(error.error_description || error.message);
      }
    } else {
      following.push(target!.id);
      targetFollowers?.push(user!.id);

      try {
        //Atualiza o perfil do usuário
        await supabase
          .from("profiles")
          .update({ following })
          .eq("id", user?.id);

        //Atualiza no perfil do visitado
        await supabase
          .from("profiles")
          .update({ followers: targetFollowers })
          .eq("id", target!.id);

        //Atualiza no front o perfil do usuário
        setUser({ ...user!, following });

        //Atualiza no front o perfil do visitado
        setTarget({ ...target!, followers: targetFollowers! });
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="font-kanit w-full bg-no-repeat bg-cover h-64 relative"
      style={{ backgroundImage: `url("${background}")` }}
    >
      <header className="relative pt-24 pb-4 backdrop-blur-sm">
        <div className="flex justify-between items-center absolute top-2 w-full px-2">
          <button
            onClick={() => router.back()}
            className="text-gray-100 px-3 py-1 rounded-md bg-dark-600 duration-200 hover:text-warning flex items-center justify-center"
          >
            <MdArrowBackIos className="lg:text-xl" />
            <span className="text-sm font-thin">VOLTAR</span>
          </button>
          <button
            className="text-sm py-1 px-3 rounded-md font-semibold bg-dark text-danube flex items-center gap-2"
            onClick={handleFollow}
          >
            <BsArrowLeftRight />
            <span>{isFollowing ? "SEGUINDO" : "SEGUIR"}</span>
          </button>
        </div>
        <div className="w-full h-12 bg-dark-600 absolute top-[60%] -translate-y-2 rounded-t-2xl backdrop-blur border-t-2 border-danube"></div>
        <div className="flex justify-center z-10">
          <div className="avatar relative z-10">
            <div className="w-20 rounded-full border-4 border-danube">
              <img
                src={target?.avatar_url}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className=""
              ></img>
            </div>
          </div>
        </div>
        <div className="bg-dark-600 relative z-10">
          <div className="flex flex-col items-center gap-0">
            <h2 className="text-gray-100 text-lg font-light">
              {target?.username}
            </h2>
          </div>
          <article className="w-2/3 m-auto">
            <ul className="flex justify-between items-center">
              <li className="w-fit font-thin p-1 text-xs rounded-md">
                <label
                  htmlFor="friend-modal"
                  onClick={() => setSeeing("followers")}
                >
                  {target?.followers.length} SEGUIDORES
                </label>
              </li>
              <li className="divider divider-horizontal"></li>
              <li className="w-fit font-thin p-1 text-xs rounded-md">
                <label
                  htmlFor="friend-modal"
                  onClick={() => setSeeing("following")}
                >
                  SEGUINDO {target?.following.length}
                </label>
              </li>
            </ul>
          </article>
        </div>
      </header>
      <main className="px-2 pt-4 lg:mt-10 lg:px-5 w-full bg-dark-600 -translate-y-4 pb-14">
        <section>
          <h1 className="ml-2 lg:ml-0 text-2xl font-thin lg:text-left lg:text-3xl text-danube">
            ÁLBUNS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-4">
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
        <section className="mt-10">
          <h1 className="ml-2 lg:ml-0 font-thin text-2xl lg:text-left lg:text-3xl text-danube">
            MÚSICAS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md">
            <ul className="carousel gap-4">
              {target?.musics.map((music, index) => (
                <li
                  key={index}
                  className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32 overflow-none"
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
                      {music.artist.map((artist, index, arr) => (
                        <span key={index}>
                          {artist}
                          {index == arr.length - 1 ? "" : ", "}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
      <FollowerFollowing modalProps={{ seeing, followers, following }} />
    </div>
  );
};

export default Profile;
