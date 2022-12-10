import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillCamera, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { MdArrowBackIos } from "react-icons/md";
import { RiDeleteBin6Fill, RiEdit2Line } from "react-icons/ri";
import { Albums, Profile } from "../../../models/interfaces";
import { useQueryData, useUser, useUserUpdate } from "../../../utils/Hooks";
import { useAuthContext } from "../../context";
import { EditDescription, RenderAlbums } from "../Profile/Visuals";

export const EditAccountHeader = () => {
  const { data } = useUser();
  if (!data) {
    return <div></div>;
  }

  const router = useRouter();
  const user = data as Profile;
  const { setError } = useAuthContext();
  const { mutate } = useUserUpdate();
  const [username, setUsername] = useState(user.username);
  const [editName, setEditName] = useState(false);
  const [avatar, setAvatar] = useState<any>(user.avatar_url);
  const [changeAvatar, setChangeAvatar] = useState(false);

  const handleNameEdit = () => {
    if (!username) {
      setError("Seu nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (username.length > 16) {
      setError("Seu nome não pode ter mais que 16 caracteres");
      return;
    }

    const payload = {
      id: user.id,
      body: { username },
    };

    try {
      mutate(payload);
    } catch (error) {
      console.log(error);
    }

    setEditName(false);
  };

  const onAvatarChange = () => {
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
                src={avatar}
                alt={user.username}
                referrerPolicy="no-referrer"
              ></img>
            </div>
            <button
              onClick={onAvatarChange}
              className="absolute top-1 right-0 translate-x-2 p-1 rounded-full bg-dark text-danube"
            >
              <AiFillCamera />
            </button>
            <input
              className="hidden"
              type="file"
              onChange={(e) => setAvatar(e.currentTarget.files?.[0])}
              id="avatar-input"
            />
          </div>
          <div className="w-full">
            <div className="flex items-center">
              <input
                className="bg-dark relative block rounded-md w-full text-center border border-transparent placeholder-gray-400 text-gray-300 text-lg focus:outline-none focus:ring-danube focus:border-danube"
                disabled={!editName}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                id="name-input"
                ref={(input) => input && input.focus()}
              />
              <div className="absolute right-4">
                {editName ? (
                  <AiOutlineCheck
                    className="text-danube"
                    onClick={handleNameEdit}
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
          <button className="pl-2" onClick={() => setEditDescription(true)}>
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
  if (!data) {
    return <div></div>;
  }
  const user = data as Profile;

  return (
    <div>
      <ul className="grid grid-cols-2 auto-rows-max place-items-center gap-2 bg-dark p-2 rounded-md">
        {user.albums.map((album, index) => (
          <AlbumGrid album={album} key={index} />
        ))}
      </ul>
    </div>
  );
};

export const AlbumGrid = ({ album }: { album: Albums }) => {
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
      <button className="absolute top-1 right-1 p-1 rounded-md text-error bg-dark">
        <RiDeleteBin6Fill />
      </button>
    </li>
  );
};
