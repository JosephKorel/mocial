import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Profile } from "../models/interfaces";
import { FollowerFollowing } from "../src/components/Profile/Modal";
import { BsArrowLeftRight } from "react-icons/bs";
import { useProfileMutation, useProfiles, useUser } from "../utils/Hooks";
import { RenderAlbums, RenderMusics } from "../src/components/Profile/Visuals";

const Profile: NextPage = () => {
  const [seeing, setSeeing] = useState("");
  const [option, setOption] = useState(1);
  const { mutate } = useProfileMutation();
  const router = useRouter();
  const { data, isLoading } = useProfiles();
  const { data: userData } = useUser();
  const { seeUser: id } = router.query as { seeUser: string };

  if (isLoading) return <div></div>;
  const user = userData as Profile;
  const profiles = data as Profile[];
  const target = profiles.filter((item) => item.id == id)[0];
  const background = target?.background
    ? target.background
    : target?.albums[0].cover.lg;
  const isFollowing = user.following.includes(target.id);

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
    if (isFollowing) {
      const onFilter = user.following.filter((item) => item != target.id);
      const onFollowerFilter = target.followers.filter(
        (item) => item != user?.id
      );
      try {
        const payload = [
          { ...user!, following: onFilter },
          { ...target!, followers: onFollowerFilter! },
        ];

        mutate(payload);
        return;
      } catch (error: any) {
        alert(error.error_description || error.message);
      }
    } else {
      const onFollow = [...user.following, target.id];
      const addFollower = [...target.followers, user.id];

      try {
        const payload = [
          { ...user!, following: onFollow },
          { ...target!, followers: addFollower },
        ];
        mutate(payload);

        return;
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
                  {target.followers.length} SEGUIDORES
                </label>
              </li>
              <li className="divider divider-horizontal"></li>
              <li className="w-fit font-thin p-1 text-xs rounded-md">
                <label
                  htmlFor="friend-modal"
                  onClick={() => setSeeing("following")}
                >
                  SEGUINDO {target.following.length}
                </label>
              </li>
            </ul>
          </article>
        </div>
      </header>
      <main className="px-2 pt-4 lg:mt-10 lg:px-5 w-full bg-dark-600 -translate-y-4 pb-14">
        <section>
          <div className="tabs">
            <a
              className={`tab font-thin text-xl duration-100 ${
                option == 1 && "text-danube text-2xl tab-active"
              }`}
              onClick={() => setOption(1)}
            >
              ÁLBUNS
            </a>
            <a
              className={`tab font-thin text-xl duration-100 ${
                option == 2 && "text-danube tab-active text-2xl"
              }`}
              onClick={() => setOption(2)}
            >
              MÚSICAS
            </a>
          </div>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-4">
              {option == 1 ? (
                <>
                  {target.albums.map((album, index) => (
                    <RenderAlbums album={album} index={index} />
                  ))}
                </>
              ) : (
                <>
                  {target.musics.map((music, index) => (
                    <RenderMusics music={music} index={index} />
                  ))}
                </>
              )}
            </ul>
          </article>
        </section>
        <section className="mt-10">
          <h1 className="ml-2 lg:ml-0 font-thin text-2xl lg:text-left lg:text-3xl text-danube">
            MÚSICAS
          </h1>
        </section>
      </main>
      <FollowerFollowing modalProps={{ seeing, followers, following }} />
    </div>
  );
};

export default Profile;
