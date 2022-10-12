import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Music } from "../../../models/interfaces";

interface BasicInfo {
  infoProps?: {
    username: string;
    setUsername: (data: string) => void;
    imgUrl: string;
    displayImg: (data: any) => void;
    step: number;
    setStep: (data: number) => void;
  };
  genreProps?: {
    genres: string[];
    selected: string[];
    setSelected: (data: string[]) => void;
    setStep: (data: number) => void;
  };

  musicProps?: {
    token: string;
    selectedMusics: Music[];
    setSelectedMusics: (data: Music[]) => void;
  };
}

export const BasicInfo = ({ infoProps }: BasicInfo): JSX.Element => {
  const { imgUrl, username, setUsername, displayImg, step, setStep } =
    infoProps!;
  return (
    <div className="flex flex-col items-center gap-2">
      {imgUrl ? (
        <img src={imgUrl} className="w-32 h-32 rounded-full"></img>
      ) : (
        <div>
          <button
            onClick={() => {
              document.getElementById("avatar_input")?.click();
            }}
            className="w-28 h-28 rounded-full border border-secondary text-secondary duration-200 hover:bg-secondary hover:text-primary cursor-pointer flex flex-col items-center justify-center"
          >
            <AiOutlinePlus className="text-4xl" />
          </button>
        </div>
      )}
      <div className="w-1/4 flex justify-center">
        <div className="w-full">
          <h2
            className={`text-3xl font-thin font-kanit ${
              username ? "text-secondary" : "text-primary"
            }`}
          >
            {username ? username : "Eu me chamo..."}
          </h2>
          <input
            className="input input-bordered input-primary w-full mt-4"
            id="username"
            type="text"
            placeholder="Nome"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <input
            id="avatar_input"
            type="file"
            onChange={(event) => displayImg(event.target.files![0])}
            className="hidden"
          />
          <button
            className="btn btn-outline btn-secondary float-right mt-4"
            onClick={() => {
              username.length > 3 && setStep(2);
            }}
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

export const GenreSelect = ({ genreProps }: BasicInfo): JSX.Element => {
  const [search, setSearch] = useState("");
  const { genres, selected, setSelected, setStep } = genreProps!;
  const addGenre = (item: string) => {
    if (selected.includes(item)) {
      //@ts-ignore
      setSelected((prev) => prev.filter((obj) => obj != item));
      return;
    }

    setSelected([...selected, item]);
    return;
  };

  const hasSelected = (item: string) => {
    return selected.includes(item) ? true : false;
  };

  const isEqual = (item: string) => {
    return item.includes(search.toLowerCase()) ? true : false;
  };
  return (
    <div className="font-kanit">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-primary text-6xl font-semibold">
          Gêneros favoritos
        </h1>
        <h2 className="text-primary text-lg font-light">
          Escolha até cinco gêneros
        </h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Procurar"
          className="input input-primary w-1/3 mt-2"
        />
        <div className="w-1/2 flex justify-start gap-2 items-center flex-wrap mt-6">
          {genres.map((genre, index) => (
            <p
              key={index}
              className={`badge cursor-pointer duration-200 hover:badge-accent uppercase ${
                hasSelected(genre) && "badge-accent"
              } ${isEqual(genre) ? "badge" : "badge-ghost"} `}
              onClick={() => addGenre(genre)}
            >
              {genre}
            </p>
          ))}
        </div>
      </div>
      <div className="w-1/2 m-auto flex justify-between items-center mt-6">
        <button
          className="btn btn-outline"
          onClick={() => {
            setStep(1);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-secondary"
          onClick={() => {
            selected.length > 3 && setStep(3);
          }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export const MusicSelect = ({ musicProps }: BasicInfo): JSX.Element => {
  const { token, selectedMusics, setSelectedMusics } = musicProps!;
  const [search, setSearch] = useState("");

  const handleSearch = async (text: string) => {
    setSearch(text);
    const parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const onFetch = await fetch(
      `https://api.spotify.com/v1/search?q=${text}&type=track&limit=10`,
      parameters
    );

    const data = await onFetch.json();

    let musics: Music[] = [];
    data.tracks.items.forEach((item: any) => {
      let artists: string[] = [];
      item.artists.forEach((artist: any) => artists.push(artist.name));
      const music = {
        id: item.id,
        name: item.name,
        artist: artists,
        cover: item.album.images[2].url,
      };

      musics.push(music);
    });

    setSelectedMusics(musics);

    console.log(data);
  };

  return (
    <div>
      <input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Procurar"
        className="input input-primary w-1/3 mt-2"
      />
      <div>
        {selectedMusics.map((item) => (
          <div className="flex items-center gap-4">
            <img src={item.cover}></img>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
