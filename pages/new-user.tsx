import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Albums, Music } from "../models/interfaces";
import { Alert } from "../src/components/Alert";
import {
  AlbumSelect,
  BasicInfo,
  GenreSelect,
  MusicSelect,
} from "../src/components/login-info";
import { supabase } from "../utils/supabaseClient";

export default function NewUser({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [img, setImg] = useState<any>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [step, setStep] = useState(1);
  const [selectedMusics, setSelectedMusics] = useState<Music[]>([]);
  const [selectedAlbums, setSelectedAlbums] = useState<Albums[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    getGenres(token);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  }, [success, error]);

  const renderComponent = (): JSX.Element => {
    switch (step) {
      case 1:
        return (
          <BasicInfo
            infoProps={{
              username,
              setUsername,
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

  async function uploadAvatar(file: any): Promise<string | void> {
    try {
      if (img == null) {
        return "";
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      alert(error.message);
    } finally {
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const avatar = await uploadAvatar(img);

      const updates = {
        id: user!.id,
        username,
        avatar_url: avatar,
        genres: selected,
        musics: selectedMusics,
        albums: selectedAlbums,
        following: [],
        followers: [],
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      router.push({
        pathname: "/[id]",
        query: { id: user!.id },
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-kanit">
      <main className="">
        <section className="mt-4 h-[45rem]">{renderComponent()}</section>
        <section className="text-center">
          <ul className="steps steps-horizontal">
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
      <Alert success={success} error={error} />
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
