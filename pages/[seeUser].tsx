import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdArrowBackIos, MdRecommend } from "react-icons/md";
import { Profile } from "../models/interfaces";
import {
  FollowerFollowing,
  SuggestModal,
} from "../src/components/Profile/Modal";
import { BsArrowLeftRight } from "react-icons/bs";
import { useProfileMutation, useProfiles, useUser } from "../utils/Hooks";
import {
  ProfileHeader,
  RenderAlbums,
  RenderMusics,
} from "../src/components/Profile/Visuals";
import ProtectedRoute from "../src/components/Protector";
import {
  getFollowers,
  getFollowing,
  handleFollow,
} from "../src/components/Profile/Visit";

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

  const followers = getFollowers(target, profiles);
  const following = getFollowing(target, profiles);
  const handleFollowParams = { isFollowing, user, target, mutate };

  const headerProps = { user: target, followers, following, setSeeing };

  return (
    <ProtectedRoute>
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
              onClick={() => handleFollow(handleFollowParams)}
            >
              <BsArrowLeftRight />
              <span>{isFollowing ? "SEGUINDO" : "SEGUIR"}</span>
            </button>
          </div>
          <div className="w-full h-16 bg-dark-600 absolute top-[38%] -translate-y-2 rounded-t-2xl backdrop-blur border-t-2 border-danube"></div>
          <ProfileHeader props={headerProps} />
        </header>
        <main className="px-2 pt-4 lg:mt-10 lg:px-5 w-full bg-dark-600 pb-20 mt-4">
          <section>
            <div className="flex justify-between items-center">
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
              <label
                className="btn btn-xs btn-primary btn-outline gap-1"
                htmlFor="suggest-modal"
              >
                SUGERIR {option == 1 ? "ALBUM" : "MÚSICA"}
                <MdRecommend />
              </label>
            </div>
            <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
              <ul className="carousel gap-4">
                {option == 1 ? (
                  <>
                    {target.albums.map((album, index) => (
                      <RenderAlbums album={album} key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {target.musics.map((music, index) => (
                      <RenderMusics music={music} key={index} />
                    ))}
                  </>
                )}
              </ul>
            </article>
          </section>
        </main>
        <FollowerFollowing
          modalProps={{ seeing, followers, following }}
          visiting
        />
        <SuggestModal option={option} targetId={target.id} />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
