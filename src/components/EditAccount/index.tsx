import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillCamera, AiOutlineCheck, AiOutlineSearch } from "react-icons/ai";
import { MdArrowBackIos } from "react-icons/md";
import { RiDeleteBin6Fill, RiEdit2Line } from "react-icons/ri";
import { Albums, Music, Profile } from "../../../models/interfaces";
import { useQueryData, useUser, useUserUpdate } from "../../../utils/Hooks";
import { useAuthContext } from "../../context";
import { Modal } from "../Profile/Modal";
import { handleAvatarUpdate, handleNameEdit } from "./tools";

export const EditAccountHeader = () => {
  const { data } = useUser();
  const user = data as Profile;
  const router = useRouter();
  const { setError } = useAuthContext();
  const { mutate } = useUserUpdate();
  const [username, setUsername] = useState(user.username);
  const [editName, setEditName] = useState(false);

  const avatarUpdateParams = {
    avatar_url: user.avatar_url,
    id: user.id,
    mutate,
    setError,
  };

  const editNameProps = {
    username,
    setError,
    id: user.id,
    mutate,
    setEditName,
  };

  const handleInput = () => {
    const avatarInput = document.getElementById("avatar-input");
    avatarInput?.click();
  };

  return (
    <div>
      <header className="py-4 px-4">
        <button
          onClick={() => router.back()}
          className="text-gray-100 px-3 py-1 rounded-md bg-dark duration-200 lg:hover:text-warning flex items-center justify-center"
        >
          <MdArrowBackIos className="lg:text-xl" />
          <span className="text-sm font-thin">VOLTAR</span>
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="avatar relative">
            <div className="w-20 rounded-full border-4 border-danube">
              <img
                src={user.avatar_url}
                alt={user.username}
                referrerPolicy="no-referrer"
              ></img>
            </div>
            <button
              onClick={handleInput}
              className="absolute top-1 right-0 translate-x-2 p-1 rounded-full bg-dark text-danube"
            >
              <AiFillCamera />
            </button>
            <input
              className="hidden"
              type="file"
              onChange={(e) => handleAvatarUpdate({ ...avatarUpdateParams, e })}
              id="avatar-input"
            />
          </div>
          <div className="w-full">
            <h1 className="text-lg">Nome</h1>
            <div className="flex items-center">
              <input
                className="bg-dark relative block rounded-md w-full text-center border border-transparent placeholder-gray-400 text-gray-300 text-lg focus:outline-none focus:ring-danube focus:border-danube"
                disabled={!editName}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                id="name-input"
                ref={(input) => input && input.focus()}
              />
              <div className="absolute right-5">
                {editName ? (
                  <AiOutlineCheck
                    className="text-danube"
                    onClick={() => handleNameEdit(editNameProps)}
                  />
                ) : (
                  <RiEdit2Line
                    className="text-danube"
                    onClick={() => setEditName(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export const Description = ({ user }: { user: Profile }) => {
  const [description, setDescription] = useState(user.description);
  const [editDescription, setEditDescription] = useState(false);
  const { mutate } = useUserUpdate();

  const cancelEdit = () => {
    setEditDescription(false);
    setDescription(user.description);
  };

  const handleEdit = () => {
    const payload = {
      id: user.id,
      body: { description },
    };

    try {
      mutate(payload);
      setEditDescription(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length
    );
  };

  return (
    <div>
      <article
        className={`w-full py-2 ${
          editDescription
            ? "border border-danube px-2"
            : "border border-transparent pl-2"
        } bg-dark rounded-md flex justify-between items-start`}
      >
        <textarea
          maxLength={120}
          value={description}
          disabled={!editDescription}
          ref={(input) => input && input.focus()}
          onFocus={(e) => setFocus(e)}
          onChange={(e) => setDescription(e.currentTarget.value)}
          className="bg-inherit text-sm text-justify rounded-md w-full placeholder-gray-400 text-gray-300 focus:outline-none "
        />
        {!editDescription && (
          <button
            className="pl-2 pr-1"
            onClick={() => setEditDescription(true)}
          >
            <RiEdit2Line className="text-danube" />
          </button>
        )}
      </article>
      {editDescription && (
        <div className="flex items-center justify-between mt-2">
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={cancelEdit}
          >
            Cancelar
          </button>
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={handleEdit}
          >
            Confirmar
          </button>
        </div>
      )}
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
    <div className="bg-dark p-2">
      <div className="rounded-lg flex justify-between items-center relative px-2">
        <input
          placeholder="Procurar álbum"
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
      <ul className="grid grid-cols-2 auto-rows-max place-items-center gap-2 rounded-md mt-2">
        {albums.map((album, index) => (
          <AlbumGrid album={album} key={index} setChildren={setChildren} />
        ))}
      </ul>
      <Modal>{children}</Modal>
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
      <Modal>{children}</Modal>
    </div>
  );
};

export const AlbumGrid = ({
  album,
  setChildren,
}: {
  album: Albums;
  setChildren: (data: JSX.Element) => void;
}) => {
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
      <button
        className="absolute top-1 right-1 p-1 text-lg rounded-md text-error bg-dark-600"
        onClick={() =>
          setChildren(<ConfirmDelete media={album} type="album" />)
        }
      >
        <label htmlFor="general-modal">
          <RiDeleteBin6Fill />
        </label>
      </button>
    </li>
  );
};

export const MusicGrid = ({
  music,
  setChildren,
}: {
  music: Music;
  setChildren: (data: JSX.Element) => void;
}) => {
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
      <button
        className="absolute top-1 right-1 p-1 text-lg rounded-md text-error bg-dark-600"
        onClick={() =>
          setChildren(<ConfirmDelete media={music} type="music" />)
        }
      >
        <label htmlFor="general-modal">
          <RiDeleteBin6Fill />
        </label>
      </button>
    </li>
  );
};

export const ConfirmDelete = ({
  media,
  type,
}: {
  media: Music;
  type: string;
}) => {
  const { mutate } = useUserUpdate();
  const { user } = useQueryData(["user"]);

  const handleDelete = () => {
    const closeBtn = document.getElementById("closeModal");
    if (type == "album") {
      const albumFilter = user.albums.filter((item) => item.id != media.id);
      let payload = { id: user.id, body: { albums: albumFilter } };
      try {
        mutate(payload);
        closeBtn?.click();
      } catch (error) {
        console.log(error);
      }
      return;
    }

    const musicFilter = user.musics.filter((item) => item.id != media.id);
    let payload = { id: user.id, body: { musics: musicFilter } };

    try {
      mutate(payload);
      closeBtn?.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-xl text-left text-gray-200">
        Remover {type == "album" ? "álbum" : "música"}
      </h1>
      <p className="text-sm text-gray-300 text-left mt-2 mb-6">
        Deseja mesmo remover {type == "album" ? "este álbum?" : "esta música?"}
      </p>
      <div className="modal-action flex justify-between items-center">
        <label
          className="btn btn-sm btn-outline"
          htmlFor="general-modal"
          id="closeModal"
        >
          Cancelar
        </label>
        <button
          className="btn btn-sm btn-error btn-outline"
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};
