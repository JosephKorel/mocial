import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Albums, Music, Profile } from "../models/interfaces";
import { Alert } from "../src/components/Alert";
import {
  AlbumSelect,
  BasicInfo,
  GenreSelect,
  MusicSelect,
} from "../src/components/LoginInfo/index";
import { useAuthContext } from "../src/context";
import { supabase } from "../utils/supabaseClient";
import { getAvatarUrl, uploadAvatar } from "./api/query-tools";

export default function NewUser({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState<any>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [step, setStep] = useState(1);
  const [selectedMusics, setSelectedMusics] = useState<Music[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<Albums[]>([]);
  const { setError } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    getGenres(token);
  }, []);

  const renderComponent = (): JSX.Element => {
    switch (step) {
      case 1:
        return (
          <BasicInfo
            infoProps={{
              username,
              setUsername,
              description,
              setDescription,
              step,
              setStep,
              displayImg,
              imgUrl,
            }}
            setError={setError}
          />
        );

      case 2:
        return (
          <GenreSelect
            genreProps={{ genres, selected, setSelected, setStep }}
            setError={setError}
          />
        );

      case 3:
        return (
          <MusicSelect
            musicProps={{
              token,
              selectedMusics,
              setSelectedMusics,
              setStep,
            }}
            setError={setError}
          />
        );

      case 4:
        return (
          <AlbumSelect
            albumProps={{
              token,
              setStep,
              selectedAlbums,
              setSelectedAlbums,
              updateProfile,
            }}
            setError={setError}
          />
        );
    }
    return <></>;
  };

  const displayImg = (file: any) => {
    const newUrl = URL.createObjectURL(file);
    setImg(file);
    setImgUrl(newUrl);
  };

  const getGenres = async (token: string) => {
    const parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const onFetch = await fetch(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      parameters
    );

    try {
      const allGenres = (await onFetch.json()) as { genres: string[] };

      setGenres(allGenres.genres);
    } catch (error) {
      console.log(error);
    }
  };

  async function handleUpload(file: any): Promise<string | void> {
    try {
      if (img == null) {
        return "";
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      await uploadAvatar(fileName, file);

      const publicUrl = getAvatarUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      alert(error.message);
      setError("Houve algum erro, tente novamente");
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const avatar = await handleUpload(img);
      const avatar_url = typeof avatar == "string" ? avatar : "";

      const updates: Profile = {
        id: user!.id,
        username,
        description,
        background: "",
        avatar_url,
        genres: selected,
        musics: selectedMusics,
        albums: selectedAlbums,
        following: [],
        followers: [],
        listen_later: [],
        suggestions: [],
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      router.push("/");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-kanit">
      <main className="">
        <section className="mt-4 h-[34rem] lg:h-[45rem]">
          {renderComponent()}
        </section>
        <section className="text-center mt-8 lg:mt-4">
          <ul className="steps steps-horizontal text-xs">
            <li className={`step step-accent mx-2`} onClick={() => setStep(1)}>
              Sobre você
            </li>
            <li
              className={`step ${step >= 2 && "step-accent"}`}
              onClick={() => username && setStep(2)}
            >
              Gêneros
            </li>
            <li className={`step ${step >= 3 && "step-accent"}`}>Músicas</li>
            <li className={`step ${step == 4 && "step-accent"}`}>Álbuns</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const parameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
  };
  const onFetch = await fetch(
    "https://accounts.spotify.com/api/token",
    parameters
  );

  const data = await onFetch.json();

  return {
    props: { token: data.access_token },
  };
}
