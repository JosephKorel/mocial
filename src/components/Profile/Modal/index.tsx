import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import {
  Albums,
  CoverImg,
  Music,
  Profile,
  Suggestion,
} from "../../../../models/interfaces";
import React, { useState } from "react";
import { useAuthContext } from "../../../context";
import { ProfilePayload } from "../../../../pages/api/query-tools";
import {
  useUserMutation,
  useUser,
  useToken,
  useSongs,
  useAlbums,
  useQueryData,
  useUserUpdate,
} from "../../../../utils/Hooks";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { formatAlbums, formatMusic } from "../../../../utils/Tools";
import { RenderMusicList } from "../Visuals";
import { handleSelect, handleSuggestion } from "./tools";

interface UsersModal {
  modalProps: {
    seeing: string;
    followers: Profile[];
    following: Profile[];
  };
}

export const FollowerFollowing = ({ modalProps }: UsersModal): JSX.Element => {
  const { seeing, followers, following } = modalProps;
  const { user } = useQueryData(["user"]);
  const title = seeing == "followers" ? "Seguidores" : "Seguindo";
  const group = seeing == "followers" ? followers : following;

  const router = useRouter();

  const goToProfile = (id: string) => {
    if (id == user.id) {
      router.push("/profile");
      const closeBtn = document.getElementById("closeFriendModal");
      closeBtn?.click();
      return;
    }

    router.push({
      pathname: "/[seeUser]",
      query: { seeUser: id },
    });

    const closeBtn = document.getElementById("closeFriendModal");
    closeBtn?.click();
  };

  return (
    <div>
      <input type="checkbox" id="friend-modal" className="modal-toggle" />
      <div className={`modal`}>
        <div className="modal-box font-kanit">
          <h3 className="text-lg">{title}</h3>
          <div className="mt-4">
            <ul className="flex flex-col gap-2 p-2 bg-dark rounded-md h-[26rem]">
              {group?.map((item, index) => (
                <li
                  key={index}
                  onClick={() => goToProfile(item.id)}
                  className="flex gap-2 items-center bg-dark rounded-md py-1 px-2 shadow-sm shadow-black"
                >
                  <div className="avatar">
                    <div className="w-10 border-2 border-primary rounded-full">
                      <img src={item.avatar_url}></img>
                    </div>
                  </div>
                  <p className="flex-1 self-start text-gray-200 text-lg">
                    {item.username}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-action flex justify-between font-kanit">
            <label
              htmlFor="friend-modal"
              id="closeFriendModal"
              className="btn btn-sm btn-outline btn-error"
            >
              Fechar
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BgModal {
  bgProps: {
    open: boolean;
    setOpen: (data: boolean) => void;
  };
}

export const BackgroundModal = ({ bgProps }: BgModal): JSX.Element => {
  const [selected, setSelected] = useState("");
  const { open, setOpen } = bgProps;
  const { setError } = useAuthContext();
  const { data, isLoading } = useUser();
  const useUpdate = useUserMutation();

  const user = isLoading ? ({} as Profile) : (data as Profile);

  const onUpdate = (payload: ProfilePayload) => {
    useUpdate.mutate(payload);
  };

  let coverImages: string[] = [];
  user?.albums.forEach((album) => coverImages.push(album.cover.lg));
  user?.musics.forEach((music) => coverImages.push(music.cover.lg));

  const changeBackground = async (): Promise<void | null> => {
    if (!selected) {
      setError("Você não selecionou nenhuma imagem");
      return null;
    }

    try {
      const payload = { id: user.id, background: selected };
      onUpdate(payload);

      const closeBtn = document.getElementById(
        "closeBgModal"
      ) as HTMLLabelElement;
      closeBtn.click();
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      return null;
    }
  };
  return (
    <div>
      <input type="checkbox" id="bg-modal" className="modal-toggle" />
      <div className={`modal ${open ? "modal-open" : ""}`}>
        <div className="modal-box font-kanit">
          <h3 className="text-lg">Alterar capa do perfil</h3>
          <div className="grid grid-cols-2 h-[26rem] overflow-y-auto auto-rows-max place-items-center gap-2 bg-dark p-2 rounded-md shadow-md shadow-black">
            {coverImages.map((cover, index) => (
              <img
                onClick={() => setSelected(cover)}
                key={index}
                src={cover}
                className={`w-32 rounded-md border-2 shadow-sm shadow-black ${
                  selected == cover ? "border-danube" : "border-dark-600"
                }`}
              ></img>
            ))}
          </div>
          <div className="modal-action flex justify-between font-kanit">
            <label
              htmlFor="bg-modal"
              id="closeBgModal"
              className="btn btn-sm btn-outline btn-error"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </label>
            <label
              className="btn btn-sm btn-outline btn-primary"
              onClick={changeBackground}
            >
              Confirmar
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SuggestModal = ({
  option,
  targetId,
}: {
  option: number;
  targetId: string;
}): JSX.Element => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Music[]>([]);
  const [selected, setSelected] = useState<Suggestion[]>([]);
  const { mutate } = useUserUpdate();
  const { user } = useQueryData(["user"]);
  const { setError, setSuccess } = useAuthContext();
  const token = useToken();
  const { data: albums } = useAlbums(search, token);
  const { data: musics } = useSongs(search, token);
  const handleSelectParams = { option, selected, setError, setSelected, user };
  const handleSuggestionParams = {
    targetId,
    selected,
    setError,
    setSuccess,
    mutate,
  };

  useEffect(() => {
    setSelected([]);
    setSearch("");
    setResults([]);
  }, [option]);

  useEffect(() => {
    if (option == 1) {
      const showAlbums = formatAlbums(albums);
      setResults(showAlbums);
      return;
    }

    const showMusics = formatMusic(musics);
    setResults(showMusics);
  }, [albums, musics]);

  const handleSearch = (text: string) => {
    if (!text) {
      setResults([]);
      setSearch("");
      return;
    }
    setSearch(text);
  };

  return (
    <div>
      <input type="checkbox" id="suggest-modal" className="modal-toggle" />
      <div className={`modal`}>
        <div className="modal-box py-3 pb-4 px-4 font-kanit">
          <h1 className="text-lg indent-1">Nova sugestão</h1>
          <input
            value={search}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            placeholder={`Procurar ${option == 1 ? "álbum" : "música"}`}
            className="bg-inherit relative block rounded-md w-full px-3 pl-8 py-2 border border-gray-300 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          />
          <section className="mt-4">
            <ul className="flex flex-col justify-start gap-2 p-2 bg-dark rounded-md h-[24rem] overflow-auto">
              {results.map((result, index) => (
                <RenderMusicList
                  key={index}
                  result={result}
                  selected={selected}
                  handleSelect={() =>
                    handleSelect({ ...handleSelectParams, choice: result })
                  }
                />
              ))}
            </ul>
            <div>
              <p>{selected.length} selecionadas</p>
            </div>
          </section>
          <div className="modal-action flex justify-between font-kanit">
            <label
              htmlFor="suggest-modal"
              className="btn btn-sm btn-outline btn-error"
              id="closeSuggestModal"
            >
              Fechar
            </label>
            <label
              className="btn btn-sm btn-outline btn-primary"
              onClick={() => handleSuggestion(handleSuggestionParams)}
            >
              Confirmar
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  suggestion,
}: {
  suggestion: Suggestion | null;
}) => {
  const { setError } = useAuthContext();
  const { user } = useQueryData(["user"]);
  const { mutate } = useUserUpdate();
  if (!suggestion) return <div></div>;
  const removeSong = () => {
    const onFilter = user.suggestions.filter(
      (item) => item.id != suggestion.id
    );

    const payload = { id: user.id, body: { suggestions: onFilter } };

    try {
      mutate(payload);

      const closeBtn = document.getElementById(
        "closeConfirmModal"
      ) as HTMLLabelElement;
      closeBtn.click();
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      console.log(error);
    }
  };
  return (
    <div>
      <input type="checkbox" id="confirm-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h1>
            Deseja mesmo remover{" "}
            {suggestion.type == "track"
              ? "esta música das suas sugestões?"
              : "este álbum das suas sugestões?"}
          </h1>
          <div className="modal-action flex justify-between font-kanit">
            <label
              htmlFor="confirm-modal"
              className="btn btn-sm btn-outline btn-error"
              id="closeConfirmModal"
            >
              Fechar
            </label>
            <label
              className="btn btn-sm btn-outline btn-primary"
              onClick={removeSong}
            >
              Confirmar
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const { setError } = useAuthContext();
  const { user } = useQueryData(["user"]);
  const { mutate } = useUserUpdate();

  return (
    <div>
      <input type="checkbox" id="general-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">{children}</div>
      </div>
    </div>
  );
};
