import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AccountProps, Profile } from "../models/interfaces";
import { useAuthContext } from "../src/context/index";
import { supabase } from "../utils/supabaseClient";

const Account: NextPage<AccountProps> = ({ profile }) => {
  const { user, setUser } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();

  useEffect(() => {
    downloadImage(profile.avatar_url);
    setUser(profile);
  }, []);

  const downloadImage = (path: string) => {
    try {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  return (
    <div className="font-kanit">
      <header className="text-center ">
        <div className="flex flex-col items-center gap-0">
          <img
            src={avatarUrl}
            alt="Avatar"
            referrerPolicy="no-referrer"
            className="rounded-2xl w-20 h-20"
          ></img>
          <h2 className="text-gray-100 leading-none text-lg font-semibold mt-2">
            {profile.username}
          </h2>
        </div>
      </header>
      <main className="mt-10 px-5">
        <section>
          <h1 className="text-3xl text-warning font-cinzel">álbuns</h1>
          <article className="py-7 px-5 bg-dark rounded-md">
            <ul className="flex items-center justify-between">
              {profile.albums.map((album) => (
                <li className="bg-dark-600 shadow-md shadow-dark-600 p-4 rounded-md flex flex-col items-center">
                  <figure>
                    <img
                      src={album.cover.md}
                      alt={album.name}
                      className="h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2 className="text-warning">{album.name}</h2>
                    <p className="text-sm">
                      {album.artist.map((artist) => artist)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <section className="mt-10">
          <h1 className="text-3xl text-warning font-cinzel">MÚSICAS</h1>
          <article className="py-7 px-5 bg-dark rounded-md">
            <ul className="flex items-center justify-between">
              {profile.musics.map((music) => (
                <li className="bg-dark-600 shadow-md shadow-dark-600 p-4 rounded-md flex flex-col items-center">
                  <figure>
                    <img
                      src={music.cover.md}
                      alt={music.name}
                      className="h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2 className="text-warning">{music.name}</h2>
                    <p className="text-sm">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const getUser = async () => {
    let { data, error, status } = await supabase
      .from("profiles")
      .select()
      .eq("id", id)
      .single();
    return data as Profile;
  };

  const data = await getUser();

  return {
    props: { profile: data },
  };
};
