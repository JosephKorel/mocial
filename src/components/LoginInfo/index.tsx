import { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { Albums, CoverImg, Music } from "../../../models/interfaces";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { CgPlayListRemove } from "react-icons/cg";
import { getArtist } from "../../../utils/Tools";

interface BasicInfo {
  setError: (data: string) => void;
  infoProps?: {
    username: string;
    setUsername: (data: string) => void;
    description: string;
    setDescription: (data: string) => void;
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
  const {
    imgUrl,
    username,
    setUsername,
    description,
    setDescription,
    displayImg,
    setStep,
  } = infoProps!;

  const handleSubmit = () => {
    if (username.length < 3) {
      setError("Seu nome deve ter no mínimo três caracteres");
      return;
    }
    setStep(2);
  };
  return (
    <div className="flex flex-col items-center gap-2 font-kanit">
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
            className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border border-primary text-gray-300 duration-200 hover:bg-secondary hover:text-primary cursor-pointer flex flex-col items-center justify-center"
          >
            <AiOutlinePlus className="text-4xl" />
          </button>
        </div>
      )}
      <div className="w-5/6 lg:w-1/4 flex justify-center">
        <div className="w-full">
          <h2
            className={`text-xl lg:text-3xl font-thin ${
              username ? "text-gray-300" : "text-gray-300"
            }`}
          >
            {username ? username : "Eu me chamo..."}
          </h2>
          <input
            className="bg-inherit relative block rounded-md w-full p-2 mt-2 border border-gray-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
            id="username"
            type="text"
            maxLength={18}
            placeholder="Nome"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <h2 className="text-xl lg:text-3xl font-thin mt-4">Sobre mim</h2>
          <textarea
            placeholder="Fale sobre você"
            value={description}
            maxLength={165}
            onChange={(e) => setDescription(e.currentTarget.value)}
            className="bg-inherit relative block h-20 mt-2 rounded-md w-full p-2 border-2 border-dark-200 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          />
          <input
            id="avatar_input"
            type="file"
            onChange={(event) => displayImg(event.target.files![0])}
            className="hidden"
          />
          <button
            className="btn btn-outline btn-primary btn-sm lg:btn-md float-right mt-4"
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
      <div className="flex flex-col justify-center items-center px-4">
        <h1 className="text-primary text-2xl lg:text-5xl font-semibold">
          Gêneros favoritos
        </h1>
        <div className="bg-dark rounded-lg flex justify-between items-center relative w-full">
          <input
            placeholder="Procurar"
            className="bg-inherit relative text-sm block rounded-md w-full px-3 pl-8 py-2 border border-gray-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AiOutlineSearch
            className={`absolute left-2 text-lg ${
              search.length ? "text-danube" : "text-gray-400"
            }`}
          />
        </div>
        <div className="lg:w-1/2 h-[26rem] overflow-auto lg:h-[32rem] flex justify-start gap-2 items-center flex-wrap mt-4">
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
          className="btn btn-outline btn-sm lg:btn-md"
          onClick={() => {
            setStep(1);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-primary btn-sm lg:btn-md w-32"
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

export const MusicSelect = ({
  musicProps,
  setError,
}: BasicInfo): JSX.Element => {
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
      isSelected.length
        ? setSelectedMusics(onFilter)
        : setError("Escolha no máximo dez músicas");
      return;
    }
    selectedMusics.filter((item) => item.id == music.id).length
      ? setSelectedMusics(onFilter)
      : setSelectedMusics([...selectedMusics, music]);
  };

  return (
    <div className="font-kanit">
      <div className="flex flex-col items-center">
        <h1 className="text-primary text-2xl lg:text-5xl font-semibold">
          Músicas favoritas
        </h1>
        <div className="w-full flex justify-center items-end relative px-4">
          <div className="bg-dark rounded-lg flex justify-between items-center relative w-full">
            <input
              placeholder="Procurar"
              className="bg-inherit relative text-sm block rounded-md w-full px-3 pl-8 py-2 border border-gray-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
              value={search}
              onChange={(e) => handleSearch(e.currentTarget.value)}
            />
            <AiOutlineSearch
              className={`absolute left-2 text-lg ${
                search.length ? "text-danube" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="w-11/12 lg:w-1/2 mx-auto px-1 lg:px-2 rounded-md mt-4 h-[26rem] lg:h-[32rem] flex flex-col gap-1 scroll-smooth scrollbar relative bg-dark">
        <div className="tabs">
          <a
            className={`tab tab-bordered ${tab == 1 ? "tab-active " : ""}`}
            onClick={() => setTab(1)}
          >
            Músicas
          </a>
          <a
            className={`tab tab-bordered ${tab == 2 && "tab-active "}`}
            onClick={() => setTab(2)}
          >
            Escolhidas {selectedMusics.length + "/10"}
          </a>
        </div>
        {tab == 1 ? (
          <div className="overflow-auto flex flex-col gap-3">
            {musics.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChoice(item)}
                className="w-full m-auto relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.cover.sm}
                    className="rounded-full w-12 lg:w-auto"
                  ></img>
                  <div className="flex flex-col self-start">
                    <p className="lg:text-lg">{item.name}</p>
                    <p className="font-thin text-gray-400 text-sm">
                      {getArtist(item.artist)}
                    </p>
                  </div>
                </div>
                <div className="self-start">
                  <button className="text-primary text-xl lg:text-2xl duration-200 lg:hover:text-led-700">
                    <MdOutlineLibraryAdd />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto flex flex-col gap-3">
            {selectedMusics.map((item, index) => (
              <div
                key={index}
                className="relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 hover:bg-base-300 p-1 px-2 rounded-lg"
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
                  className="text-2xl self-start text-error duration-200 lg:hover:text-error"
                  onClick={() => handleChoice(item)}
                >
                  <CgPlayListRemove />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-11/12 lg:w-1/2 m-auto flex justify-between items-center mt-4 relative z-10">
        <button
          className="btn btn-outline btn-sm lg:btn-md"
          onClick={() => {
            setStep(2);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-primary w-32 btn-sm lg:btn-md"
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

export const AlbumSelect = ({
  albumProps,
  setError,
}: BasicInfo): JSX.Element => {
  const [search, setSearch] = useState("");
  const [albums, setAlbums] = useState<Albums[]>([]);
  const [tab, setTab] = useState(1);

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
      isSelected.length
        ? setSelectedAlbums(onFilter)
        : setError("Escolha no máximo cinco àlbuns");
      return;
    }

    selectedAlbums.filter((item) => item.id == album.id).length
      ? setSelectedAlbums(onFilter)
      : setSelectedAlbums([...selectedAlbums, album]);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-primary text-2xl lg:text-5xl font-semibold">
          Àlbuns favoritos
        </h1>
        <div className="w-full flex justify-center items-end relative px-4">
          <div className="bg-dark rounded-lg flex justify-between items-center relative w-full">
            <input
              placeholder="Procurar"
              className="bg-inherit relative text-sm block rounded-md w-full px-3 pl-8 py-2 border border-gray-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
              value={search}
              onChange={(e) => handleSearch(e.currentTarget.value)}
            />
            <AiOutlineSearch
              className={`absolute left-2 text-lg ${
                search.length ? "text-danube" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="w-11/12 lg:w-1/2 px-1 lg:px-2 mx-auto mt-4 h-[26rem] lg:h-[32rem] flex flex-col gap-1 scroll-smooth scrollbar relative bg-dark rounded-md">
        <div className="tabs">
          <a
            className={`tab tab-bordered ${tab == 1 && "tab-active "}`}
            onClick={() => setTab(1)}
          >
            Àlbuns
          </a>
          <a
            className={`tab tab-bordered ${tab == 2 && "tab-active "}`}
            onClick={() => setTab(2)}
          >
            Escolhidos {selectedAlbums.length + "/5"}
          </a>
        </div>
        {tab == 1 ? (
          <div className="flex flex-col gap-3 overflow-auto">
            {albums.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChoice(item)}
                className="w-full relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4 ">
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
                <div className="self-start">
                  <button className="text-primary text-xl lg:text-2xl duration-200 lg:hover:text-led-700">
                    <MdOutlineLibraryAdd />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-auto">
            {selectedAlbums.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChoice(item)}
                className="relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg"
              >
                <div className="flex items-center gap-4 ">
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
                <div className="self-start">
                  <button className="text-error text-2xl duration-200 lg:hover:text-led-700">
                    <CgPlayListRemove />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-11/12 lg:w-1/2 m-auto flex justify-between items-center relative z-10 mt-4">
        <button
          className="btn btn-outline btn-sm lg:btn-md"
          onClick={() => {
            setStep(3);
          }}
        >
          VOLTAR
        </button>
        <button
          className="btn btn-outline btn-primary btn-sm lg:btn-md w-32"
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
