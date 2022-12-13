import { useRouter } from "next/router";
import { AiOutlineCheck, AiOutlineInfoCircle } from "react-icons/ai";
import { BiLibrary } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdAlbum } from "react-icons/md";
import { RiDeleteBackLine } from "react-icons/ri";
import { ListenLater, Profile } from "../../../../models/interfaces";
import { useUser, useUserUpdate } from "../../../../utils/Hooks";
import { artistName, cardTitle } from "../../../../utils/Tools";
import { useAuthContext } from "../../../context";
import { RiMusicFill } from "react-icons/ri";
import { checkListened, handleAdd } from "./tools";

export const ListenLaterSection = () => {
  const { data } = useUser();
  const user = data as Profile;
  return (
    <div>
      <h1 className="text-2xl text-gray-200 font-thin indent-4">
        OUVIR DEPOIS
      </h1>
      {user.listen_later.length > 0 ? (
        <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
          <ul className="carousel gap-4">
            {user.listen_later.map((item) => (
              <ListenLaterItems media={item} />
            ))}
          </ul>
        </article>
      ) : (
        <div className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
          <h2>
            As músicas e álbums que você salvou para ouvir depois aparecerão
            aqui
          </h2>
        </div>
      )}
    </div>
  );
};

export const ListenLaterItems = ({ media }: { media: ListenLater }) => {
  return (
    <li className="bg-dark-600 h-44 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32 relative">
      <figure className="">
        <img
          src={media.cover.md}
          alt={media.name}
          className="h-32 lg:h-52 rounded-md"
        ></img>
      </figure>
      <div className="self-start">
        <h2 className="text-gray-100">{cardTitle(media.name)}</h2>
        <p className="text-sm text-gray-400">{artistName(media.artist)}</p>
      </div>
      {media.listened ? (
        <span className="text-secondary text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600">
          <AiOutlineCheck />
        </span>
      ) : (
        <>
          {media.type == "music" ? (
            <span className="text-danube text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600">
              <RiMusicFill />
            </span>
          ) : (
            <span className="text-danube text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600">
              <MdAlbum />
            </span>
          )}
        </>
      )}

      <MediaOptions media={media} type={media.type} />
    </li>
  );
};

export const MediaOptions = ({
  media,
  type,
}: {
  media: ListenLater;
  type: string;
}) => {
  const { setError, setSuccess } = useAuthContext();
  const { data } = useUser();
  const { mutate } = useUserUpdate();
  const router = useRouter();
  const user = data as Profile;
  const checkParams = { media, user, mutate, setError };
  const addParams = { type, user, mutate, setError, media, setSuccess };
  return (
    <div className="absolute top-0 left-0 rounded-md bg-dark-600">
      <div className="dropdown dropdown-bottom">
        <button className="text-gray-300 text-xl p-1">
          <BsThreeDots />
        </button>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content text-gray-300 shadow bg-base-200 rounded-md w-52"
        >
          <li onClick={() => checkListened(checkParams)}>
            <a
              className={`${
                media.listened ? "text-gray-500" : "text-gray-300"
              }`}
            >
              <AiOutlineCheck />
              Marcar como ouvido
            </a>
          </li>
          <li onClick={() => handleAdd(addParams)}>
            <a>
              <BiLibrary />
              Adicionar à biblioteca
            </a>
          </li>
          <li>
            <a>
              <AiOutlineInfoCircle />
              Sobre
            </a>
          </li>
          <li>
            <a>
              <RiDeleteBackLine /> Remover
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
