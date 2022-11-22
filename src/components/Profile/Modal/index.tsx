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
} from "../../../../utils/Hooks";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { formatAlbums, formatMusic } from "../../../../utils/Tools";

interface UsersModal {
  modalProps: {
    seeing: string;
    followers: () => Profile[];
    following: () => Profile[];
  };
}

export const FollowerFollowing = ({ modalProps }: UsersModal): JSX.Element => {
  const { seeing, followers, following } = modalProps;
  const title = seeing == "followers" ? "Seguidores" : "Seguindo";
  const group = seeing == "followers" ? followers() : following();

  const router = useRouter();

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
                  className="flex justify-between items-center bg-dark-600 rounded-lg py-1 px-2 shadow-sm shadow-black"
                >
                  <div className="avatar">
                    <div className="w-10 border-2 border-primary rounded-full">
                      <img src={item.avatar_url}></img>
                    </div>
                  </div>
                  <p className="flex-1 pl-2 self-start text-gray-200 text-lg">
                    {item.username}
                  </p>
                  <button
                    className="btn btn-xs btn-ghost text-primary self-start font-normal gap-1"
                    onClick={() =>
                      router.push({
                        pathname: "/[seeUser]",
                        query: { seeUser: item.id },
                      })
                    }
                  >
                    <BsBoxArrowInUpRight />
                    Perfil
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-action flex justify-between font-kanit">
            <label
              htmlFor="friend-modal"
              className="btn btn-sm btn-outline btn-error"
            >
              Fechar
            </label>
            {/* <label
                className="btn btn-sm btn-outline btn-primary"
            
              >
                Confirmar
              </label> */}
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

export const SuggestModal = ({ option }: { option: number }): JSX.Element => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Music[]>([]);
  const [selected, setSelected] = useState<Suggestion[]>([]);
  const token = useToken();
  const viewing =
    option == 1 ? useAlbums(search, token) : useSongs(search, token);

  useEffect(() => {
    if (!viewing.data) return;

    if (option == 1) {
      const albums = formatAlbums(viewing.data);
      setResults(albums);
      return;
    }

    const musics = formatMusic(viewing.data);
    setResults(musics);
  }, [viewing.data]);

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
        <div className="modal-box py-3 pb-4 px-3 font-kanit">
          <h3 className="text-lg">Nova sugestão</h3>
          <input
            value={search}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            placeholder="Procurar álbum ou música"
            className="bg-inherit relative block rounded-md w-full px-3 pl-8 py-2 border border-danube placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          />
          <section className="mt-4">
            <ul className="flex flex-col justify-start gap-2 p-2 bg-dark rounded-md h-[26rem] overflow-auto">
              {results.map((result, index) => (
                <li
                  key={index}
                  className="w-full m-auto relative z-10 cursor-pointer flex justify-between items-center bg-dark-600 duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg"
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
                        }`}
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
                  <div className="self-start">
                    <button className="text-danube text-xl lg:text-2xl duration-200 lg:hover:text-danube-600">
                      <MdOutlineLibraryAdd />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <div className="modal-action flex justify-between font-kanit">
            <label
              htmlFor="suggest-modal"
              className="btn btn-sm btn-outline btn-error"
            >
              Fechar
            </label>
            {/* <label
                className="btn btn-sm btn-outline btn-primary"
            
              >
                Confirmar
              </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};
