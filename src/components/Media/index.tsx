import { useRouter } from "next/router";
import { MdOutlineAccessTimeFilled, MdOutlineLibraryAdd } from "react-icons/md";
import { Music, Profile } from "../../../models/interfaces";
import { useAuthContext } from "../../context";
import { BiLibrary } from "react-icons/bi";
import { useUser, useUserUpdate } from "../../../utils/Hooks";
import { addToListenLater, handleAdd } from "./tools";
import { AiOutlineCheck } from "react-icons/ai";
import { getArtist } from "../../../utils/Tools";
import { BsThreeDots } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";

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
      onClick={() => setElement(<AddOptions media={media} type={type} />)}
      className="text-gray-300 text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600"
    >
      <BsThreeDots />
    </label>
  );
};

export const AddOptions = ({ media, type }: { media: Music; type: string }) => {
  const { setSuccess, setError } = useAuthContext();
  const { mutate } = useUserUpdate();
  const { data } = useUser();
  const user = data as Profile;
  const addParams = { type, user, mutate, setError, media, setSuccess };
  return (
    <div className="bg-gradient-to-b from-dark-400 to-dark-600 px-4 py-8 rounded-md shadow-md shadow-black">
      <div className="flex flex-col items-center">
        <div className="">
          <img
            src={media.cover.md}
            alt={media.name}
            className="rounded-md w-32"
          ></img>
        </div>
        <h1 className="text-lg font-semibold mt-2">{media.name}</h1>
        <span className="text-gray-400">{getArtist(media.artist)}</span>
      </div>
      <ul className="flex flex-col gap-2 mt-8">
        <li
          className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-danube"
          onClick={() => handleAdd(addParams)}
        >
          <BiLibrary className="" />
          <span>Adicionar à biblioteca</span>
        </li>
        <li
          onClick={() => addToListenLater(addParams)}
          className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-danube"
        >
          <MdOutlineAccessTimeFilled className="" />
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
