import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Account() {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");

  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  const downloadImage = (path: string) => {
    try {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const getProfile = async () => {
    try {
      const user = await supabase.auth.getUser();
      const id = user.data.user?.id;
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        downloadImage(data.avatar_url);
        setUserId(id!);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
    }
  };

  return (
    <div className="">
      <header className="text-center ">
        <div className="flex flex-col items-center gap-0">
          <img
            src={avatarUrl}
            alt="Avatar"
            referrerPolicy="no-referrer"
            className="rounded-2xl w-20 h-20"
          ></img>
          <h2 className="text-gray-100 leading-none text-lg font-semibold mt-2">
            {username}
          </h2>
        </div>
      </header>
      <main className="mt-10"></main>
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
}
