import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Profile } from "../models/interfaces";
import { supabase } from "../utils/supabaseClient";

type AccountProps = {
  profile: Profile;
};

const Account: NextPage<AccountProps> = ({ profile }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();

  useEffect(() => {
    downloadImage(profile.avatar_url);
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
        <section className="py-2 px-5">
          <h1 className="text-3xl text-gray-100 font-light">Meus àlbuns</h1>
          <article className="flex justify-between items-center">
            {profile.albums.map((album) => (
              <div className="card card-compact bg-dark shadow-xl border border-warning">
                <figure>
                  <img
                    src={album.cover.md}
                    alt={album.name}
                    className="h-64"
                  ></img>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-warning">{album.name}</h2>
                  <p>{album.artist.map((artist) => artist)}</p>
                </div>
              </div>
            ))}
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
