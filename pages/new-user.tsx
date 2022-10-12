import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Music } from "../models/interfaces";
import {
  BasicInfo,
  GenreSelect,
  MusicSelect,
} from "../src/components/login-info/info-steps";
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
              step,
              setStep,
              displayImg,
              imgUrl,
            }}
          />
        );

      case 2:
        return (
          <GenreSelect
            genreProps={{ genres, selected, setSelected, setStep }}
          />
        );

      case 3:
        return (
          <MusicSelect
            musicProps={{ token, selectedMusics, setSelectedMusics }}
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
        throw new Error("You must select an image to upload.");
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

      return filePath;
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
        avatar: avatar,
        genres: selected,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

      router.push({
        pathname: "/[account]",
        query: { account: user!.id },
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
        <section className="mt-4 h-[42rem]">{renderComponent()}</section>
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
            <li className="step">Músicas</li>
            <li className="step">Álbuns</li>
          </ul>
        </section>
      </main>
      {/* <div>
        <button
          className="btn btn-warning"
          onClick={() => supabase.auth.signOut()}
        >
          SAIR
        </button>
      </div> */}
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
