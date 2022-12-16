import { MdOutlineAccessTimeFilled, MdQueueMusic } from "react-icons/md";
import { Albums, Music, Profile } from "../../../models/interfaces";
import { useAuthContext } from "../../context";
import { BiLibrary } from "react-icons/bi";
import {
  useAbout,
  useToken,
  useUser,
  useUserUpdate,
} from "../../../utils/Hooks";
import { addToListenLater, getInfo, handleAdd } from "./tools";
import { getArtist } from "../../../utils/Tools";
import { BsCalendar2DateFill, BsThreeDots } from "react-icons/bs";
import { RiTimerFill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";

export const MediaOptions = ({
  common,
  media,
  type,
}: {
  common: boolean;
  media: Music;
  type: string;
}) => {
  const { setElement } = useAuthContext();
  /* if (common) {
    return (
      <button className="text-gray-200 text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600">
        <AiOutlineCheck />
      </button>
    );
  } */

  return (
    <label
      htmlFor="transparent-modal"
      onClick={(e) => {
        setElement(<AddOptions media={media} type={type} />);
        e.stopPropagation();
      }}
      className="text-gray-300 text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600"
    >
      <BsThreeDots />
    </label>
  );
};

export const AddOptions = ({ media, type }: { media: Music; type: string }) => {
  const { setSuccess, setError, setElement } = useAuthContext();
  const { mutate } = useUserUpdate();
  const { data } = useUser();
  const user = data as Profile;
  const addParams = {
    type,
    user,
    mutate,
    setError,
    media,
    setSuccess,
    setElement,
  };
  return (
    <div className="px-2 py-8 rounded-md">
      <div className="flex flex-col items-center">
        <div className="">
          <img
            src={media.cover.md}
            alt={media.name}
            className="rounded-md w-32"
          ></img>
        </div>
        <h1 className="text-lg font-semibold mt-2 text-center">{media.name}</h1>
        <span className="text-gray-400">{getArtist(media.artist)}</span>
      </div>
      <ul className="flex flex-col gap-2 mt-8">
        <li
          className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-dark-400"
          onClick={() => handleAdd(addParams)}
        >
          <BiLibrary className="text-gray-500" />
          <span>Adicionar à biblioteca</span>
        </li>
        <li
          onClick={() => addToListenLater(addParams)}
          className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-dark-400"
        >
          <MdOutlineAccessTimeFilled className="text-gray-500" />
          <span>Ouvir depois</span>
        </li>
      </ul>
      <div className="invisible">
        <label
          htmlFor="transparent-modal"
          className="py-1 px-3 rounded-md text-gray-200 bg-red-500"
          id="closeModal"
        >
          Cancelar
        </label>
      </div>
    </div>
  );
};

export const About = ({ media }: { media: Albums }) => {
  const token = useToken();
  const type = media.type == "album" ? "albums" : "tracks";
  const { data, isLoading } = useAbout(type, media.id, token);
  const mediaType = media.type == "album" ? "Álbum" : "Música";
  const { release_date, duration_min, total_tracks, link } = getInfo(
    data,
    media
  );
  const detailProps = {
    mediaType,
    release_date,
    link,
    total_tracks,
    duration_min,
  };

  console.log(media);

  return (
    <div>
      <div className="flex justify-end">
        <label htmlFor="general-modal" className="mr-2">
          <AiOutlineClose className="text-gray-400" />
        </label>
      </div>
      <div className="flex items-start gap-2 mt-2">
        <img
          src={media.cover.md}
          alt={media.name}
          className="w-40 rounded-sm"
        ></img>
        {isLoading ? (
          <div className="self-center flex justify-center w-full">
            <ImSpinner9 className="animate-spin" />
          </div>
        ) : (
          <Details params={detailProps} />
        )}
      </div>
      <div className="text-center mt-2">
        <h1 className="text-xl font-semibold">{media.name}</h1>
        <span className="text-lg text-gray-400 font-light italic">
          {getArtist(media.artist)}
        </span>
      </div>
    </div>
  );
};

interface DetailProps {
  mediaType: string;
  release_date: string;
  total_tracks: string;
  duration_min: string;
  link: string;
}

export const Details = ({ params }: { params: DetailProps }) => {
  const { mediaType, release_date, link, total_tracks, duration_min } = params;
  return (
    <div>
      <div className="badge badge-accent ml-2 -translate-y-1">
        <span>{mediaType}</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm">
          <BsCalendar2DateFill className="text-gray-400" />
          <label className="text-gray-400">Data de lançamento</label>
        </div>
        <span className="text-sm italic font-light pl-5 text-gray-200">
          {release_date}
        </span>
      </div>
      {mediaType == "Álbum" && (
        <>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm">
              <MdQueueMusic className="text-base text-gray-400" />
              <label className="text-gray-400">Faixas</label>
            </div>
            <span className="text-sm italic font-light pl-5 text-gray-200">
              {total_tracks}
            </span>
          </div>
        </>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm">
          <RiTimerFill className="text-gray-400" />
          <label className="text-gray-400">Duração</label>
        </div>
        <span className="text-sm italic font-light pl-5 text-gray-200">
          {duration_min}
        </span>
      </div>
      <div>
        <a
          href={link}
          rel="noreferrer"
          target="_blank"
          className="link link-primary ml-5 text-sm"
        >
          Ver no Spotify
        </a>
      </div>
    </div>
  );
};
