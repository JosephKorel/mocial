import { NextPage } from "next";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import { Profile, Suggestion } from "../models/interfaces";
import {
  BackgroundModal,
  ConfirmModal,
  FollowerFollowing,
  Modal,
} from "../src/components/Profile/Modal";
import { useQueryData, useUser } from "../utils/Hooks";
import {
  ProfileHeader,
  ProfileOptions,
  RenderAlbums,
  RenderMusics,
} from "../src/components/Profile/Visuals";
import { RenderSuggestions } from "../src/components/Profile/Suggestion";
import ProtectedRoute from "../src/components/Protector";
import { getFollowers, getFollowing } from "../src/components/Profile/Visit";

const Account: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [seeing, setSeeing] = useState("");
  const [option, setOption] = useState(1);
  const [children, setChildren] = useState<React.ReactNode | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const { data, isLoading } = useUser();
  const { profiles } = useQueryData(["profiles"]);
  const router = useRouter();
  if (isLoading) return <div></div>;
  const user = data as Profile;

  const background = user?.background
    ? user.background
    : user?.albums[0].cover.lg;

  const followers = getFollowers(user, profiles);
  const following = getFollowing(user, profiles);

  const headerProps = {
    user,
    setSeeing,
    followers,
    following,
    setChildren,
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div
        className="font-kanit w-full bg-no-repeat bg-cover h-64 relative"
        style={{ backgroundImage: `url("${background}")` }}
      >
        <header className="relative pt-24 pb-2 backdrop-blur-sm">
          <ProfileOptions props={{ handleLogout, setOpen }} />
          <div className="w-full h-16 bg-dark-600 absolute top-[38%] -translate-y-2 rounded-t-2xl backdrop-blur border-t-2 border-danube"></div>
          <ProfileHeader props={headerProps} />
        </header>
        <main className="px-1 pt-4 lg:mt-10 lg:px-5 w-full bg-dark-600 pb-14 mt-5">
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
                    {user.albums.map((album, index) => (
                      <RenderAlbums album={album} key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {user.musics.map((music, index) => (
                      <RenderMusics music={music} key={index} />
                    ))}
                  </>
                )}
              </ul>
            </article>
          </section>
          <section className="mt-10 px-1">
            <h1 className="text-2xl text-danube font-thin indent-4">
              SUGESTÕES
            </h1>
            <article>
              <ul className="h-60 overflow-auto">
                {user.suggestions.map((item, index) => (
                  <RenderSuggestions
                    result={item}
                    key={index}
                    setSuggestion={setSuggestion}
                    setChildren={setChildren}
                  />
                ))}
              </ul>
            </article>
          </section>
        </main>
        <BackgroundModal bgProps={{ open, setOpen }} />
        <FollowerFollowing modalProps={{ seeing, followers, following }} />
        <ConfirmModal suggestion={suggestion} />
        <Modal>{children}</Modal>
      </div>
    </ProtectedRoute>
  );
};

export default Account;
