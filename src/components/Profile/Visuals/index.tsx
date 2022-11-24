import { BsThreeDots } from "react-icons/bs";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { RiDeleteBackLine } from "react-icons/ri";
import { Albums, Music, Suggestion } from "../../../../models/interfaces";
import { useQueryData, useUserUpdate } from "../../../../utils/Hooks";
import { useAuthContext } from "../../../context";

export const RenderAlbums = ({
  album,
  index,
}: {
  album: Albums;
  index: number;
}) => {
  return (
    <li
      key={index}
      className="bg-dark-600 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32"
    >
      <figure className="">
        <img
          src={album.cover.md}
          alt={album.name}
          className="h-32 lg:h-52 rounded-md"
        ></img>
      </figure>
      <div className="self-start">
        <h2 className={`text-gray-100 ${album.name.length > 20 && "text-xs"}`}>
          {album.name}
        </h2>
        <p className="text-sm text-gray-400">
          {album.artist.map((artist, index) => (
            <span key={index}>{artist}</span>
          ))}
        </p>
      </div>
    </li>
  );
};

export const RenderMusics = ({
  music,
  index,
}: {
  music: Music;
  index: number;
}) => {
  return (
    <li
      key={index}
      className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32"
    >
      <figure>
        <img
          src={music.cover.md}
          alt={music.name}
          className="h-32 lg:h-52 rounded-md"
        ></img>
      </figure>
      <div className="self-start">
        <h2 className={`text-gray-100 ${music.name.length > 20 && "text-xs"}`}>
          {music.name}
        </h2>
        <p
          className={`text-sm text-gray-400 ${
            music.artist.length > 1 && "text-xs"
          }`}
        >
          {music.artist.map((artist, index) => (
            <span key={index}>{artist}</span>
          ))}
        </p>
      </div>
    </li>
  );
};

export const RenderMusicList = ({
  result,
  index,
  handleSelect,
}: {
  result: Music;
  index: number;
  handleSelect: (data: Music) => void;
}) => {
  return (
    <li
      key={index}
      className="w-full m-auto relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg"
    >
      <div className="flex items-center gap-4">
        <img
          src={result.cover.sm}
          className="rounded-full w-12 lg:w-auto"
        ></img>
        <div className="flex flex-col self-start">
          <p
            className={`lg:text-lg ${
              result.name.length > 25 ? "text-sm" : "text-base"
            }`}
          >
            {result.name}
          </p>
          <p className="font-thin text-gray-400 text-sm">
            {result.artist.map((obj, i, arr) => {
              return i == arr.length - 1 ? obj : obj + ", ";
            })}
          </p>
        </div>
      </div>
      <div className="self-start">
        <button
          className="text-danube text-xl lg:text-2xl duration-200 lg:hover:text-danube-600"
          onClick={() => handleSelect(result)}
        >
          <MdOutlineLibraryAdd />
        </button>
      </div>
    </li>
  );
};

export const RenderSuggestions = ({
  result,
  setSuggestion,
}: {
  result: Suggestion;
  setSuggestion: (data: Suggestion) => void;
}) => {
  const { profiles } = useQueryData(["profiles"]);
  const sentBy = (id: string) => {
    const [user] = profiles.filter((item) => item.id == id);

    return user.username;
  };

  return (
    <li className="w-full mt-2 m-auto relative cursor-pointer bg-dark duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg">
      <div className=" flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <img
            src={result.cover.sm}
            className="rounded-full w-12 lg:w-auto"
          ></img>
          <div className="flex flex-col self-start">
            <p
              className={`lg:text-lg ${
                result.name.length > 25 ? "text-sm" : "text-base"
              }`}
            >
              {result.name}
            </p>
            <p className="font-thin text-gray-400 text-sm">
              {result.artist.map((obj, i, arr) => {
                return i == arr.length - 1 ? obj : obj + ", ";
              })}
            </p>
          </div>
        </div>
        <div className="dropdown dropdown-end self-start">
          <button
            tabIndex={0}
            className="p-1 px-2 rounded-md bg-dark-600 text-gray-100"
          >
            <BsThreeDots />
          </button>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content text-gray-300 shadow bg-base-200 rounded-md w-60"
          >
            <li>
              <a>
                <MdOutlineLibraryAdd />
                Adicionar{" "}
                {result.type == "track"
                  ? "às minhas músicas"
                  : "aos meus álbuns"}
              </a>
            </li>
            <li>
              <label
                htmlFor="confirm-modal"
                onClick={() => setSuggestion(result)}
              >
                <RiDeleteBackLine /> Remover
              </label>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-right text-sm font-light text-gray-100">
        sugerido por{" "}
        <span className="font-medium text-danube">
          {sentBy(result.sent_by!)}
        </span>
      </p>
    </li>
  );
};
