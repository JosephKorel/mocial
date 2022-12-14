import { AiOutlineCheck, AiOutlineInfoCircle } from "react-icons/ai";
import { BiLibrary } from "react-icons/bi";
import { BsCheck2, BsCheck2All, BsThreeDots } from "react-icons/bs";
import { MdAlbum } from "react-icons/md";
import { RiDeleteBackLine, RiDeleteBin6Line } from "react-icons/ri";
import { ListenLater, Profile } from "../../../../models/interfaces";
import { useUser, useUserUpdate } from "../../../../utils/Hooks";
import { artistName, cardTitle, getArtist } from "../../../../utils/Tools";
import { useAuthContext } from "../../../context";
import { RiMusicFill } from "react-icons/ri";
import { checkListened, handleAdd, removeMedia } from "./tools";

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
            {user.listen_later.map((item, index) => (
              <ListenLaterItems media={item} key={index} />
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
  const { setElement } = useAuthContext();
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
      <label
        onClick={() =>
          setElement(<OpenOptions media={media} type={media.type} />)
        }
        className="text-gray-300 text-xl p-1 absolute top-0 left-0 rounded-md bg-dark-600"
        htmlFor="transparent-modal"
      >
        <BsThreeDots />
      </label>
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
  const { setError, setSuccess, setElement } = useAuthContext();
  const { data } = useUser();
  const { mutate } = useUserUpdate();
  const user = data as Profile;
  const checkParams = { media, user, mutate, setError, setElement };
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

export const AddToLibraryNotification = ({
  handleAdd,
}: {
  handleAdd?: (data: any) => void;
}) => {
  const { setNotification } = useAuthContext();
  return (
    <div className="pb-1 px-2">
      <p className="leading-3 text-left">Deseja adicionar a sua biblioteca?</p>
      <div className="flex items-center gap-8 mt-2">
        <button
          className="btn btn-xs btn-outline btn-secondary"
          onClick={handleAdd}
        >
          Sim
        </button>
        <button
          className="btn btn-xs btn-outline btn-error"
          onClick={() => setNotification(null)}
        >
          Não
        </button>
      </div>
    </div>
  );
};

export const OpenOptions = ({
  media: item,
  type,
}: {
  media: ListenLater;
  type: string;
}) => {
  const { setSuccess, setError, setNotification } = useAuthContext();
  const { mutate } = useUserUpdate();
  const { data } = useUser();
  const user = data as Profile;
  const list = user.listen_later;
  const [media] = list.filter((obj) => obj.id == item.id);
  if (!media) return <></>;
  const checkParams = {
    type,
    user,
    mutate,
    setError,
    media,
    setSuccess,
    setNotification,
  };

  return (
    <div className="rounded-md">
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
          onClick={() => checkListened(checkParams)}
        >
          {media.listened ? (
            <>
              <BsCheck2All className="text-gray-500" />
              <span className="text-gray-500">Ouviu</span>
            </>
          ) : (
            <>
              <BsCheck2 className="text-gray-500" />
              <span>Já ouvi</span>
            </>
          )}
        </li>
        <li
          className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-dark-400"
          onClick={() => handleAdd(checkParams)}
        >
          <BiLibrary className="text-gray-500" />
          <span>Adicionar à biblioteca</span>
        </li>
        <li className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-dark-400">
          <AiOutlineInfoCircle className="text-gray-500" />
          <span>Sobre</span>
        </li>
        <li
          onClick={() => removeMedia(checkParams)}
          className="bg-dark-600 rounded-md flex items-center gap-2 p-2 border border-dark-400"
        >
          <RiDeleteBin6Line className="text-gray-500" />
          <span>Remover</span>
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
