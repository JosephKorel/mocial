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
import { useQueryData, useUser, useUserUpdate } from "../../../../utils/Hooks";
import { Avatar } from "../../Avatar";
import { cardTitle } from "../../../../utils/Tools";
import { AiOutlineCheck, AiOutlineSearch } from "react-icons/ai";
import { AlbumGrid, MusicGrid } from "../../EditAccount";
import { SpareModal } from "../Modal";
import { useAuthContext } from "../../../context";
import { AddToMyLibrary } from "../Visit";

export const RenderAlbums = ({ album }: { album: Albums }) => {
  const { user } = useQueryData(["user"]);
  const { setElement } = useAuthContext();
  const router = useRouter();
  const visiting = router.pathname != "/profile";
  const sameMedia = user.albums.filter((item) => item.id == album.id).length
    ? true
    : false;
  return (
    <li className="bg-dark-600 h-44 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32 relative">
      <figure className="">
        <img
          src={album.cover.md}
          alt={album.name}
          className="h-32 lg:h-52 rounded-md"
        ></img>
      </figure>
      <div className="self-start">
        <h2 className="text-gray-100">{cardTitle(album.name)}</h2>
        <p className="text-sm text-gray-400">
          {album.artist.map((artist, index) => (
            <span key={index}>{artist}</span>
          ))}
        </p>
      </div>
      {visiting && (
        <>
          {sameMedia ? (
            <button className="text-gray-200 text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600">
              <AiOutlineCheck />
            </button>
          ) : (
            <label
              htmlFor="general-modal"
              onClick={() =>
                setElement(<AddToMyLibrary type="album" media={album} />)
              }
              className="text-secondary text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600"
            >
              <MdOutlineLibraryAdd />
            </label>
          )}
        </>
      )}
    </li>
  );
};

export const RenderMusics = ({ music }: { music: Music }) => {
  const { user } = useQueryData(["user"]);
  const { setElement } = useAuthContext();
  const router = useRouter();
  const visiting = router.pathname != "/profile";
  const sameMedia = user.musics.filter((item) => item.id == music.id).length
    ? true
    : false;
  return (
    <li className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32 relative">
      <figure>
        <img
          src={music.cover.md}
          alt={music.name}
          className="h-32 lg:h-52 rounded-md"
        ></img>
      </figure>
      <div className="self-start">
        <h2 className="text-gray-100">{cardTitle(music.name)}</h2>
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
      {visiting && (
        <>
          {sameMedia ? (
            <button className="text-gray-200 text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600">
              <AiOutlineCheck />
            </button>
          ) : (
            <label
              htmlFor="general-modal"
              onClick={() =>
                setElement(<AddToMyLibrary type="music" media={music} />)
              }
              className="text-secondary text-xl p-1 absolute top-0 right-0 rounded-md bg-dark-600"
            >
              <MdOutlineLibraryAdd />
            </label>
          )}
        </>
      )}
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

export const ShowAll = ({ component }: { component: JSX.Element }) => {
  return (
    <div>
      {component}
      <div className="modal-action flex justify-between items-center">
        <label
          className="btn btn-sm btn-outline btn-error"
          htmlFor="general-modal"
          id="closeModal"
        >
          Fechar
        </label>
      </div>
    </div>
  );
};

export const SeeAlbums = () => {
  const { data } = useUser();
  const [search, setSearch] = useState("");
  const [children, setChildren] = useState(<></>);
  if (!data) {
    return <div></div>;
  }
  const user = data as Profile;

  const albums = search.length
    ? user.albums.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : user.albums;

  return (
    <div className="bg-dark p-2 rounded-md h-[30rem] overflow-y-auto">
      <div className="rounded-lg flex justify-between items-center relative px-2">
        <input
          placeholder="Procurar álbum"
          className="bg-inherit relative block rounded-md text-sm w-full px-3 pl-8 py-1 border border-dark-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AiOutlineSearch
          className={`absolute left-4 text-lg ${
            search.length ? "text-danube" : "text-gray-400"
          }`}
        />
      </div>
      <ul className="grid grid-cols-2 auto-rows-max place-items-center gap-2 rounded-md mt-2">
        {albums.map((album, index) => (
          <AlbumGrid album={album} key={index} setChildren={setChildren} />
        ))}
      </ul>
      <SpareModal>{children}</SpareModal>
    </div>
  );
};

export const SeeMusics = () => {
  const [search, setSearch] = useState("");
  const [children, setChildren] = useState(<></>);
  const { data } = useUser();
  if (!data) {
    return <div></div>;
  }
  const user = data as Profile;

  const musics = search.length
    ? user.musics.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : user.musics;

  return (
    <div className="bg-dark p-2">
      <div className="rounded-lg flex justify-between items-center relative px-2">
        <input
          placeholder="Procurar música"
          className="bg-inherit relative block rounded-md text-sm w-full px-3 pl-8 py-1 border border-gray-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AiOutlineSearch
          className={`absolute left-4 text-lg ${
            search.length ? "text-danube" : "text-gray-400"
          }`}
        />
      </div>
      <ul className="grid grid-cols-2 auto-rows-max place-items-center gap-2 rounded-md">
        {musics.map((music, index) => (
          <MusicGrid music={music} key={index} setChildren={setChildren} />
        ))}
      </ul>
      <SpareModal>{children}</SpareModal>
    </div>
  );
};
