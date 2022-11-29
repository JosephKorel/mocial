import { MdOutlineLibraryAdd } from "react-icons/md";

import { Albums, Music } from "../../../../models/interfaces";

export const RenderAlbums = ({ album }: { album: Albums }) => {
  return (
    <li className="bg-dark-600 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32">
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

export const RenderMusics = ({ music }: { music: Music }) => {
  return (
    <li className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32">
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
  handleSelect,
}: {
  result: Music;
  handleSelect: (data: Music) => void;
}) => {
  return (
    <li className="w-full m-auto relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg">
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
