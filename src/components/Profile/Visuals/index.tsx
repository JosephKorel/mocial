import { useState } from "react";
import { useRouter } from "next/router";
import { BsThreeDots } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import {
  MdArrowBackIos,
  MdOutlineLibraryAdd,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import {
  Albums,
  Music,
  Profile,
  Suggestion,
} from "../../../../models/interfaces";
import { useQueryData, useUserUpdate } from "../../../../utils/Hooks";
import { Avatar } from "../../Avatar";

export const RenderAlbums = ({
  album,
  last,
}: {
  album: Albums;
  last?: boolean;
}) => {
  const router = useRouter();
  const visiting = router.pathname != "/profile";
  return (
    <li className="bg-dark-600 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32 relative">
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
      {last ? (
        <button className="py-1 px-3 bg-dark-600 text-gray-300 rounded-md absolute top-0 right-0">
          Ver todos
        </button>
      ) : (
        <button
          className={` ${
            visiting
              ? "p-2 text-lg bg-dark-600 text-primary rounded-md absolute top-0 right-0"
              : "hidden"
          }`}
        >
          <MdOutlineLibraryAdd />
        </button>
      )}
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
  selected,
  handleSelect,
}: {
  result: Music;
  selected: Suggestion[];
  handleSelect: (data: Music) => void;
}) => {
  const isSelected = selected.filter((item) => item.id == result.id).length
    ? true
    : false;

  return (
    <li
      className={`w-full m-auto relative border ${
        isSelected ? "border-danube" : "border-transparent"
      } z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg`}
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
            } ${isSelected && "text-danube font-medium"} `}
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
      <div className="self-start px-1">
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

interface Options {
  setOpen: (data: boolean) => void;
  handleLogout: () => void;
}

export const ProfileOptions = ({ props }: { props: Options }) => {
  const router = useRouter();
  const { setOpen, handleLogout } = props;
  return (
    <div>
      <div className="flex justify-between items-center absolute top-2 w-full px-2">
        <button
          onClick={() => router.back()}
          className="text-gray-100 px-3 py-1 rounded-md bg-dark-600 duration-200 hover:text-warning flex items-center justify-center"
        >
          <MdArrowBackIos className="lg:text-xl" />
          <span className="text-sm font-thin">VOLTAR</span>
        </button>
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="p-1 px-2 rounded-md bg-dark-600 text-gray-100"
          >
            <BsThreeDots />
          </button>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content text-gray-300 shadow bg-base-200 rounded-md w-44"
          >
            <li>
              <label
                htmlFor="bg-modal"
                className=""
                onClick={() =>
                  setTimeout(() => {
                    setOpen(true);
                  }, 100)
                }
              >
                <IoMdImages className="" />
                Alterar fundo
              </label>
            </li>
            <li>
              <a className="" onClick={() => router.push("/edit-account")}>
                <MdOutlineManageAccounts className="text-lg" />
                Preferências
              </a>
            </li>
            <li onClick={handleLogout}>
              <a>
                <VscSignOut className="text-error" /> Sair
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  user: Profile;
  followers: Profile[];
  following: Profile[];
  setSeeing: (data: string) => void;
  setChildren?: (data: JSX.Element) => void;
}

export const ProfileHeader = ({ props }: { props: HeaderProps }) => {
  const { user, setSeeing, followers, following, setChildren } = props;

  return (
    <div>
      <div className="flex justify-center z-10">
        <Avatar user={user} className="border-4 border-danube w-20" />
      </div>
      <div className="bg-dark-600 relative z-10">
        <div className="flex flex-col items-center gap-0">
          <h2 className="text-gray-100 text-lg font-light">{user?.username}</h2>
        </div>
        <article className="px-2">
          <ul className="flex justify-center items-center gap-1">
            {user.genres.map((genre, index) => (
              <li key={index}>
                <span className="badge badge-sm badge-primary badge-outline">
                  {genre}
                </span>
              </li>
            ))}
          </ul>
        </article>
        <article className="w-2/3 m-auto mt-2">
          <ul className="flex justify-between items-center">
            <li className="w-fit font-thin text-sm rounded-md flex flex-col gap-0 items-center">
              <span className="font-normal text-base">0</span>
              <label htmlFor="friend-modal">POSTS</label>
            </li>
            <li className="w-fit font-thin text-sm rounded-md flex flex-col gap-0 items-center">
              <span className="font-normal text-base">{followers.length}</span>
              <label
                htmlFor="friend-modal"
                onClick={() => setSeeing("followers")}
              >
                SEGUIDORES
              </label>
            </li>
            <li className="w-fit font-thin text-sm rounded-md flex flex-col gap-0 items-center">
              <span className="font-normal text-base">{following.length}</span>
              <label
                htmlFor="friend-modal"
                onClick={() => setSeeing("following")}
              >
                SEGUINDO
              </label>
            </li>
          </ul>
        </article>
        <div className={`${user.description ? "h-24" : "h-10"}`}>
          <Description user={user} />
        </div>
      </div>
    </div>
  );
};

export const Description = ({ user }: { user: Profile }) => {
  const { user: currentUser } = useQueryData(["user"]);

  return (
    <article className="w-11/12 m-auto py-2 px-4 shadow-md shadow-black rounded-md">
      <p className="text-justify text-sm">{user.description}</p>
    </article>
  );
};

export const EditDescription = () => {
  const { user } = useQueryData(["user"]);
  const { mutate } = useUserUpdate();
  const [description, setDescription] = useState(user.description);

  const handleEdit = () => {
    const payload = {
      id: user.id,
      body: { description },
    };

    const closeBtn = document.getElementById("closeModal");

    try {
      mutate(payload);
      closeBtn?.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-xl text-left text-gray-200">Editar descrição</h1>
      <textarea
        placeholder="Escreva seu comentário"
        value={description}
        maxLength={120}
        onChange={(e) => setDescription(e.currentTarget.value)}
        className="bg-inherit text-sm font-light relative block h-20 mt-4 rounded-md w-full p-3 border border-dark-200 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
      />
      <div className="modal-action flex justify-between items-center">
        <label
          className="btn btn-sm btn-outline"
          htmlFor="general-modal"
          id="closeModal"
        >
          Cancelar
        </label>
        <button
          className="btn btn-sm btn-primary btn-outline"
          onClick={handleEdit}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};
