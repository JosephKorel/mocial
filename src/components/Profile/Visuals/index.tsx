import { Albums, Music } from "../../../../models/interfaces";

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
