import { NextPage } from "next";
import { useRouter } from "next/router";
import { MdArrowBackIos } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";
import { useAuthContext } from "../src/context/index";
import { supabase } from "../utils/supabaseClient";
import { BsThreeDots } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { useState } from "react";

const Account: NextPage = () => {
  const { user, setUser, setProfiles, setError } = useAuthContext();
  const background = user?.background
    ? user.background
    : user?.albums[0].cover.lg;

  const router = useRouter();

  const BackgroundModal = (): JSX.Element => {
    const [selected, setSelected] = useState("");
    let coverImages: string[] = [];
    user?.albums.forEach((album) => coverImages.push(album.cover.lg));
    user?.musics.forEach((music) => coverImages.push(music.cover.lg));

    const changeBackground = async (): Promise<void | null> => {
      if (!selected) {
        setError("Você não selecionou nenhuma imagem");
        return null;
      }

      try {
        await supabase
          .from("profiles")
          .update({ background: selected })
          .eq("id", user?.id);

        setUser({ ...user!, background: selected });

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
        <div className="modal">
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

  return (
    <div
      className="font-kanit w-full bg-no-repeat bg-cover h-64 relative"
      style={{ backgroundImage: `url("${background}")` }}
    >
      <header className="relative pt-24 pb-4 backdrop-blur-sm">
        <div className="flex justify-between items-center absolute top-2 w-full px-2">
          <button
            onClick={() => router.back()}
            className="text-gray-100 px-2 rounded-md bg-dark-600 duration-200 hover:text-warning flex items-center justify-center"
          >
            <MdArrowBackIos className="lg:text-xl" />
            <p className="text-sm font-thin">VOLTAR</p>
          </button>
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="p-[2px] px-2 rounded-md bg-dark-600 text-gray-100"
            >
              <BsThreeDots />
            </button>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content text-gray-300 shadow bg-base-200 rounded-md w-44"
            >
              <li>
                <label htmlFor="bg-modal" className="">
                  <IoMdImages className="" />
                  Alterar fundo
                </label>
              </li>
              <li
                onClick={() => {
                  supabase.auth.signOut();
                  router.push("/login");
                  setUser(null);
                  setProfiles([]);
                }}
              >
                <a>
                  <VscSignOut className="text-error" /> Sair
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full h-12 bg-dark-600 absolute top-[60%] -translate-y-2 rounded-t-2xl backdrop-blur border-t-2 border-danube"></div>
        <div className="flex justify-center z-10">
          <div className="avatar relative z-10">
            <div className="w-20 rounded-full border-4 border-danube">
              <img
                src={user?.avatar_url}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className=""
              ></img>
            </div>
          </div>
        </div>
        <div className="bg-dark-600 relative z-10">
          <div className="flex flex-col items-center gap-0">
            <h2 className="text-gray-100 text-lg font-light">
              {user?.username}
            </h2>
          </div>
          <article className="w-2/3 m-auto">
            <ul className="flex justify-between items-center">
              <li className="w-fit font-thin p-1 text-xs rounded-md">
                {user?.followers.length} SEGUIDORES
              </li>
              <li className="divider divider-horizontal"></li>
              <li className="w-fit font-thin p-1 text-xs rounded-md">
                SEGUINDO {user?.following.length}
              </li>
            </ul>
          </article>
        </div>
      </header>
      <main className="px-1 lg:mt-10 lg:px-5 w-full bg-dark-600 -translate-y-4 pb-14">
        <section>
          <h1 className="ml-2 lg:ml-0 text-2xl font-thin lg:text-left lg:text-3xl text-danube">
            ÁLBUNS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-4">
              {user?.albums.map((album, index) => (
                <li
                  key={index}
                  className="bg-dark-600 carousel-item shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32"
                >
                  <figure className="">
                    <img
                      src={album.cover.md}
                      alt={album.name}
                      className="h-32 lg:h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2
                      className={`text-gray-100 ${
                        album.name.length > 20 && "text-xs"
                      }`}
                    >
                      {album.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {album.artist.map((artist, index) => (
                        <span key={index}>{artist}</span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <section className="mt-10 px-1">
          <h1 className="ml-2 lg:ml-0 font-thin text-2xl lg:text-left lg:text-3xl text-danube">
            MÚSICAS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md">
            <ul className="carousel gap-4">
              {user?.musics.map((music, index) => (
                <li
                  key={index}
                  className="carousel-item bg-dark-600 shadow-md shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center w-32"
                >
                  <figure>
                    <img
                      src={music.cover.md}
                      alt={music.name}
                      className="h-32 lg:h-52 rounded-md"
                    ></img>
                  </figure>
                  <div className="self-start">
                    <h2
                      className={`text-gray-100 ${
                        music.name.length > 20 && "text-xs"
                      }`}
                    >
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
              ))}
            </ul>
          </article>
        </section>
      </main>
      <BackgroundModal />
    </div>
  );
};

export default Account;
