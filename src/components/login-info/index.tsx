import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Albums, CoverImg, Music } from "../../../models/interfaces";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { CgPlayListRemove } from "react-icons/cg";

interface BasicInfo {
  setError: (data: string) => void;
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
    setStep: (data: number) => void;
  };
  albumProps?: {
    token: string;
    selectedAlbums: Albums[];
    setSelectedAlbums: (data: Albums[]) => void;
    setStep: (data: number) => void;
    updateProfile: () => Promise<void>;
  };
}

export const BasicInfo = ({ infoProps, setError }: BasicInfo): JSX.Element => {
  const { imgUrl, username, setUsername, displayImg, setStep } = infoProps!;

  const handleSubmit = () => {
    if (username.length < 3) {
      setError("Seu nome deve ter no mínimo três caracteres");
      return;
    }
    setStep(2);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      {imgUrl ? (
        <img
          src={imgUrl}
          className="w-20 h-20 lg:w-28 lg:h-28 rounded-full"
        ></img>
      ) : (
        <div>
          <button
            onClick={() => {
              document.getElementById("avatar_input")?.click();
            }}
            className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border border-secondary text-secondary duration-200 hover:bg-secondary hover:text-primary cursor-pointer flex flex-col items-center justify-center"
          >
            <AiOutlinePlus className="text-4xl" />
          </button>
        </div>
      )}
      <div className="w-5/6 lg:w-1/4 flex justify-center">
        <div className="w-full">
          <h2
            className={`text-xl lg:text-3xl font-thin font-kanit ${
              username ? "text-secondary" : "text-primary"
            }`}
          >
            {username ? username : "Eu me chamo..."}
          </h2>
          <input
            className="input input-bordered input-primary w-full mt-1 lg:mt-4"
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
            className="btn btn-outline btn-secondary btn-sm lg:btn-lg float-right mt-4"
            onClick={handleSubmit}
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

export const GenreSelect = ({
  genreProps,
  setError,
}: BasicInfo): JSX.Element => {
  const [search, setSearch] = useState("");
  const { genres, selected, setSelected, setStep } = genreProps!;

  const addGenre = (item: string) => {
    if (selected.length == 5) {
      hasSelected(item)
        ? setSelected(selected.filter((obj) => obj != item))
        : setError("Você só pode selecionar até cinco gêneros");
    } else
      selected.includes(item)
        ? setSelected(selected.filter((obj) => obj != item))
        : setSelected([...selected, item]);
  };

  const hasSelected = (item: string) => {
    return selected.includes(item) ? true : false;
  };

  const isEqual = (item: string) => {
    if (selected.includes(item)) return true;
    return item.includes(search.toLowerCase()) ? true : false;
  };
  return (
    <div className="font-kanit">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-primary text-2xl lg:text-5xl font-semibold">
          Gêneros favoritos
        </h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Procurar"
          className="input input-primary w-5/6 input-sm lg:input-lg lg:w-1/3 mt-2"
        />
        <div className="w-11/12 lg:w-1/2 h-[26rem] overflow-auto lg:h-[32rem] flex justify-start gap-2 items-center flex-wrap mt-4">
          {genres.map((genre, index) => (
            <p
              key={index}
              className={`badge lg:badge-lg cursor-pointer duration-200 lg:hover:badge-warning uppercase ${
                hasSelected(genre) ? "badge-warning" : ""
              } ${isEqual(genre) ? "badge" : "badge-ghost"} ${
                selected.length == 5 && !hasSelected(genre) ? "badge-ghost" : ""
              }`}
              onClick={() => addGenre(genre)}
            >
              {genre}
            </p>
          ))}
        </div>
      </div>
      <div className="w-11/12 lg:w-1/2 m-auto flex justify-between items-center mt-4">
        <button
          className="btn btn-outline btn-sm lg:btn-lg"
          onClick={() => {
            setStep(1);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-secondary btn-sm lg:btn-lg w-32"
          onClick={() => {
            selected.length >= 3 && setStep(3);
          }}
          disabled={selected.length < 3 ? true : false}
        >
          {selected.length >= 3 ? "CONTINUAR" : selected.length + "/3"}
        </button>
      </div>
    </div>
  );
};

export const MusicSelect = ({ musicProps }: BasicInfo): JSX.Element => {
  const { token, setStep, selectedMusics, setSelectedMusics } = musicProps!;
  const [search, setSearch] = useState("");
  const [musics, setMusics] = useState<Music[]>([]);
  const [tab, setTab] = useState(1);

  const handleSearch = async (text: string) => {
    if (!text) {
      setSearch("");
      setMusics([]);
      return;
    }
    setSearch(text);
    const parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const onFetch = await fetch(
        `https://api.spotify.com/v1/search?q=${text}&type=track&limit=10`,
        parameters
      );

      const data = await onFetch.json();
      let musics: Music[] = [];
      data.tracks.items.forEach((item: any) => {
        let artists: string[] = [];
        const coverImg: CoverImg = {
          sm: item.album.images[2].url,
          md: item.album.images[1].url,
          lg: item.album.images[0].url,
        };

        item.artists.forEach((artist: any) => artists.push(artist.name));
        const music = {
          id: item.id,
          name: item.name,
          artist: artists,
          cover: coverImg,
        };

        musics.push(music);
      });
      setMusics(musics);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (music: Music) => {
    const onFilter = selectedMusics.filter((item) => item.id != music.id);

    if (selectedMusics.length == 10) {
      const isSelected = selectedMusics.filter((item) => item.id == music.id);
      isSelected.length && setSelectedMusics(onFilter);
      return;
    }
    selectedMusics.filter((item) => item.id == music.id).length
      ? setSelectedMusics(onFilter)
      : setSelectedMusics([...selectedMusics, music]);
  };

  return (
    <div className="font-kanit">
      <div className="w-11/12 m-auto lg:w-auto flex flex-col items-center">
        <h1 className="text-xl lg:text-5xl font-semibold">Músicas favoritas</h1>
        <div className="w-full flex justify-center items-end relative">
          {/*   <p className="absolute left-5">Escolha até dez músicas</p> */}
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Procurar"
            className="input input-primary w-5/6 input-sm lg:input-lg lg:w-1/2 mt-2"
          />
        </div>
      </div>
      <div className="mt-4 h-[26rem] lg:h-[32rem] flex flex-col gap-3 overflow-y-auto scroll-smooth scrollbar relative">
        <div className="tabs">
          <a
            className={`tab tab-lifted bg-dark-400 ${
              tab == 1 && "tab-active bg-dark"
            }`}
            onClick={() => setTab(1)}
          >
            Músicas
          </a>
          <a
            className={`tab tab-lifted bg-dark-400 ${
              tab == 2 && "tab-active bg-dark"
            }`}
            onClick={() => setTab(2)}
          >
            Escolhidas
          </a>
        </div>
        {/* <div className="fixed left-5 w-full flex flex-col gap-2">
          <div className="flex flex-col h-[32rem] overflow-y-auto gap-2">
            {selectedMusics.map((item, index) => (
              <div
                key={index}
                className="w-[20%] flex justify-between text-warning border border-warning items-center p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4 ">
                  <img src={item.cover.sm} className="rounded-full"></img>
                  <div className="flex flex-col">
                    <p className="">{item.name}</p>
                    <p className="font-thin text-sm text-gray-400">
                      {item.artist.map((obj, i, arr) => {
                        return i == arr.length - 1 ? obj : obj + ", ";
                      })}
                    </p>
                  </div>
                </div>
                <button
                  className="text-2xl text-warning duration-200 hover:text-error"
                  onClick={() => handleChoice(item)}
                >
                  <CgPlayListRemove />
                </button>
              </div>
            ))}
          </div>
          <p>
            {selectedMusics.length > 0 &&
              selectedMusics.length + "/10" + " selecionadas"}
          </p>
        </div> */}
        {tab == 1 ? (
          <>
            {musics.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChoice(item)}
                className="w-11/12 lg:w-1/2 m-auto relative z-10 cursor-pointer flex justify-between items-center bg-base-200 duration-200 hover:bg-base-300 p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.cover.sm}
                    className="rounded-full w-12 lg:w-auto"
                  ></img>
                  <div className="flex flex-col self-start">
                    <p className="lg:text-lg">{item.name}</p>
                    <p className="font-thin text-gray-400 text-sm">
                      {item.artist.map((obj, i, arr) => {
                        return i == arr.length - 1 ? obj : obj + ", ";
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <button className="text-warning text-2xl duration-200 hover:text-led-700">
                    <MdOutlineLibraryAdd />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {selectedMusics.map((item, index) => (
              <div
                key={index}
                className="w-11/12 lg:w-1/2 m-auto relative z-10 cursor-pointer flex justify-between items-center bg-base-200 duration-200 hover:bg-base-300 p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.cover.sm}
                    className="rounded-full w-12 lg:w-auto"
                  ></img>
                  <div className="flex flex-col self-start">
                    <p className="lg:text-lg">{item.name}</p>
                    <p className="font-thin text-sm text-gray-400">
                      {item.artist.map((obj, i, arr) => {
                        return i == arr.length - 1 ? obj : obj + ", ";
                      })}
                    </p>
                  </div>
                </div>
                <button
                  className="text-2xl text-warning duration-200 hover:text-error"
                  onClick={() => handleChoice(item)}
                >
                  <CgPlayListRemove />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="w-11/12 lg:w-1/2 m-auto flex justify-between items-center mt-4 relative z-10">
        <button
          className="btn btn-outline btn-sm lg:btn-lg"
          onClick={() => {
            setStep(2);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-secondary w-32 btn-sm lg:btn-lg"
          disabled={selectedMusics.length >= 5 ? false : true}
          onClick={() => {
            selectedMusics.length >= 5 && setStep(4);
          }}
        >
          {selectedMusics.length >= 5
            ? "CONTINUAR"
            : selectedMusics.length + "/5"}
        </button>
      </div>
    </div>
  );
};

export const AlbumSelect = ({ albumProps }: BasicInfo): JSX.Element => {
  const [search, setSearch] = useState("");
  const [albums, setAlbums] = useState<Albums[]>([]);

  const { token, setStep, selectedAlbums, setSelectedAlbums, updateProfile } =
    albumProps!;
  const handleSearch = async (text: string) => {
    if (!text) {
      setSearch("");
      setAlbums([]);
      return;
    }
    setSearch(text);
    const parameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const onFetch = await fetch(
        `https://api.spotify.com/v1/search?q=${text}&type=album&limit=10`,
        parameters
      );

      const data = await onFetch.json();

      let albums: Albums[] = [];
      data.albums.items.forEach((item: any) => {
        let artists: string[] = [];
        const coverImg: CoverImg = {
          sm: item.images[2].url,
          md: item.images[1].url,
          lg: item.images[0].url,
        };

        item.artists.forEach((artist: any) => artists.push(artist.name));

        const album = {
          id: item.id,
          name: item.name,
          artist: artists,
          cover: coverImg,
        };

        albums.push(album);
      });

      setAlbums(albums);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (album: Albums) => {
    const onFilter = selectedAlbums.filter((item) => item.id != album.id);
    if (selectedAlbums.length == 5) {
      const isSelected = selectedAlbums.filter((item) => item.id == album.id);
      isSelected.length && setSelectedAlbums(onFilter);
      return;
    }

    selectedAlbums.filter((item) => item.id == album.id).length
      ? setSelectedAlbums(onFilter)
      : setSelectedAlbums([...selectedAlbums, album]);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-light">
          Estes àlbuns vão comigo para a cova
        </h1>
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Procurar"
          className="input input-primary w-1/2 mt-2"
        />
      </div>
      <div className="mt-4 h-[32rem] flex flex-col gap-3 overflow-y-auto scroll-smooth scrollbar relative">
        <div className="fixed left-5 w-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 h-[32rem]">
            {selectedAlbums.map((item, index) => (
              <div
                key={index}
                className="w-[20%] flex justify-between text-warning border border-warning items-center p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4 ">
                  <img src={item.cover.sm} className="rounded-full"></img>
                  <div className="flex flex-col">
                    <p className="text-lg">{item.name}</p>
                    <p className="font-thin text-gray-400">
                      {item.artist.map((obj, i, arr) => {
                        return i == arr.length - 1 ? obj : obj + ", ";
                      })}
                    </p>
                  </div>
                </div>
                <button
                  className="text-2xl text-warning duration-200 hover:text-error"
                  onClick={() => handleChoice(item)}
                >
                  <CgPlayListRemove />
                </button>
              </div>
            ))}
          </div>
          <p>
            {selectedAlbums.length > 0 &&
              selectedAlbums.length + "/5" + " selecionados"}
          </p>
        </div>
        {albums.map((item, index) => (
          <div
            key={index}
            onClick={() => handleChoice(item)}
            className="w-1/2 m-auto relative z-10 cursor-pointer flex justify-between items-center bg-base-200 duration-200 hover:bg-base-300 p-1 px-2 rounded-lg"
          >
            <div className="flex items-center gap-4 ">
              <img src={item.cover.sm} className="rounded-full"></img>
              <div className="flex flex-col">
                <p className="text-lg">{item.name}</p>
                <p className="font-thin text-gray-400">
                  {item.artist.map((obj, i, arr) => {
                    return i == arr.length - 1 ? obj : obj + ", ";
                  })}
                </p>
              </div>
            </div>
            <div>
              <button className="text-warning text-2xl duration-200 hover:text-led-700">
                <MdOutlineLibraryAdd />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/2 m-auto flex justify-between items-center relative z-10 mt-4">
        <button
          className="btn btn-outline"
          onClick={() => {
            setStep(3);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-secondary w-32"
          disabled={selectedAlbums.length == 5 ? false : true}
          onClick={updateProfile}
        >
          {selectedAlbums.length == 5
            ? "CONTINUAR"
            : selectedAlbums.length + "/5"}
        </button>
      </div>
    </div>
  );
};
