import { Music, Profile } from "../../../models/interfaces";
import { IoCloseOutline } from "react-icons/io5";
import { BsBoxArrowUpRight, BsThreeDots } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineUserAdd } from "react-icons/ai";
import { useAuthContext } from "../../context";
import { supabase } from "../../../utils/supabaseClient";
import { MdLibraryAdd } from "react-icons/md";
import { FaHeadphonesAlt } from "react-icons/fa";

interface UserProfileProps {
  target: Profile | null;
  setTarget: (data: Profile) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ target, setTarget }) => {
  const { user, setUser, setSuccess, setError } = useAuthContext();
  const isFollowing = target?.id ? user!.following.includes(target.id) : false;
  const getCommonMusics = user?.musics.map((music) => {
    return target?.musics.filter((item) => item.id == music.id).length
      ? music
      : null;
  });

  const isCommonMusic = (id: string): boolean => {
    return user?.musics.filter((music) => music.id == id).length ? true : false;
  };

  const handleFollow = async (): Promise<void> => {
    //Info do usuário
    let following = user!.following;
    const isFollowing = user!.following.includes(target!.id);

    //Info do visitado
    let targetFollowers = target?.followers;

    if (isFollowing) {
      const onFilter = following.filter((item) => item != target!.id);
      const onFollowerFilter = targetFollowers?.filter(
        (item) => item != user?.id
      );
      try {
        //Atualiza no perfil do usuário
        await supabase
          .from("profiles")
          .update({ following: onFilter })
          .eq("id", user?.id);

        //Atualiza no perfil do visitado
        await supabase
          .from("profiles")
          .update({ followers: onFollowerFilter })
          .eq("id", target!.id);

        //Atualiza no front o perfil do usuário
        setUser({ ...user!, following: onFilter });

        //Atualiza no front o perfil do visitado
        setTarget({ ...target!, followers: onFollowerFilter! });
      } catch (error: any) {
        alert(error.error_description || error.message);
      }
    } else {
      following.push(target!.id);
      targetFollowers?.push(user!.id);

      try {
        //Atualiza o perfil do usuário
        await supabase
          .from("profiles")
          .update({ following })
          .eq("id", user?.id);

        //Atualiza no perfil do visitado
        await supabase
          .from("profiles")
          .update({ followers: targetFollowers })
          .eq("id", target!.id);

        //Atualiza no front o perfil do usuário
        setUser({ ...user!, following });

        //Atualiza no front o perfil do visitado
        setTarget({ ...target!, followers: targetFollowers! });
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const addToMyMusics = async (music: Music): Promise<void | null> => {
    const isMyMusic = user?.musics.filter((item) => item.id == music.id);

    if (isMyMusic?.length) {
      setError("Está música já faz parte de suas músicas");
      return null;
    }

    const addMusic = [...user?.musics!, music];

    try {
      //Atualiza o perfil do usuário
      await supabase
        .from("profiles")
        .update({ musics: addMusic })
        .eq("id", user?.id);

      //Atualiza no frontend
      setUser({ ...user!, musics: addMusic });
      setSuccess("Música adicionada");
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      return null;
    }
  };

  return (
    <div className="font-kanit relative">
      <header className="w-full">
        <div className="flex flex-row-reverse sticky top-0">
          <label htmlFor="my-modal" className="text-right text-xl">
            <IoCloseOutline />
          </label>
        </div>
        <div className="flex items-start justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img
                  src={target?.avatar_url}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className=""
                ></img>
              </div>
            </div>
            <h2 className="text-gray-100 text-lg self-start font-light">
              {target?.username}
            </h2>
          </div>
          <button
            className="gap-2 btn btn-outline btn-tertiary btn-sm font-light"
            onClick={handleFollow}
          >
            {isFollowing ? (
              <>
                <AiOutlineCheck />
                SEGUINDO
              </>
            ) : (
              <>
                <AiOutlineUserAdd />
                SEGUIR
              </>
            )}
          </button>
        </div>
        <article className="w-2/3 m-auto">
          <ul className="flex justify-between items-center">
            <li className="w-fit font-thin p-1 text-xs rounded-md">
              {target?.followers.length} SEGUIDORES
            </li>
            <li className="divider divider-horizontal"></li>
            <li className="w-fit font-thin p-1 text-xs rounded-md">
              SEGUINDO {target?.following.length}
            </li>
          </ul>
        </article>
      </header>
      <main className="mt-5 lg:mt-10 lg:px-5 w-full">
        <section>
          <h1 className="ml-2 lg:ml-0 font-thin text-2xl lg:text-left lg:text-3xl text-danube">
            MÚSICAS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md">
            <ul className="carousel gap-4">
              {target?.musics.map((music, index, musics) => (
                <li
                  key={index}
                  className={`carousel-item bg-dark-600 shadow-md ${
                    isCommonMusic(music.id) ? "" : ""
                  } shadow-dark-600 p-2 lg:p-4 rounded-md flex flex-col items-center justify-between w-32 overflow-visible`}
                >
                  <div>
                    <figure>
                      <img
                        src={music.cover.md}
                        alt={music.name}
                        className="h-32 lg:h-52 rounded-md"
                      ></img>
                    </figure>
                    <div className="self-start">
                      <h2
                        className={` ${
                          music.name.length > 20 && "text-xs"
                        } text-gray-100 `}
                      >
                        {music.name}
                      </h2>
                      <p
                        className={`text-gray-400 ${
                          music.artist.length > 1 ? "text-xs" : "text-sm"
                        }`}
                      >
                        {music.artist.map((artist, i, arr) => {
                          return i == arr.length - 1 ? artist : artist + ", ";
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`dropdown ${
                      index == musics.length - 1
                        ? "dropdown-top dropdown-end"
                        : "dropdown-top"
                    } self-start relative z-10`}
                  >
                    <label tabIndex={0} className="">
                      <BsThreeDots />
                    </label>
                    <ul
                      tabIndex={0}
                      className="menu menu-compact dropdown-content mt-3 shadow bg-base-200 rounded-md w-44"
                    >
                      <li onClick={() => addToMyMusics(music)}>
                        <a>
                          <MdLibraryAdd className="text-secondary" />
                          Minhas músicas
                        </a>
                      </li>
                      <li>
                        <a>
                          <FaHeadphonesAlt className="text-secondary" /> Ouvir
                          depois
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <section className="mt-10">
          <h1 className="ml-2 lg:ml-0 text-2xl font-thin lg:text-left lg:text-3xl text-danube">
            ÁLBUNS
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-4">
              {target?.albums.map((album, index) => (
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
                      {album.artist.map((artist, i, arr) => {
                        return i == arr.length - 1 ? artist : artist + ", ";
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
