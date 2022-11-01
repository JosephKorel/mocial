import { Profile } from "../../../models/interfaces";
import { IoCloseOutline } from "react-icons/io5";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineUserAdd } from "react-icons/ai";
import { useAuthContext } from "../../context";
import { supabase } from "../../../utils/supabaseClient";

interface UserProfileProps {
  target: Profile | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ target }) => {
  const { user, setUser } = useAuthContext();
  const isFollowing = target?.id ? user!.following.includes(target.id) : false;
  const handleFollow = async () => {
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

        setUser({ ...user!, following: onFilter });
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

        setUser({ ...user!, following });
      } catch (error: any) {
        console.log(error);
      }
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
            className="gap-2 btn btn-outline btn-warning btn-sm font-light"
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
      </header>
      <main className="mt-5 lg:mt-10 lg:px-5 w-full">
        <section>
          <h1 className="ml-2 lg:ml-0 text-xl lg:text-left lg:text-3xl text-warning font-cinzel">
            álbuns
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
                      className={`text-warning ${
                        album.name.length > 20 && "text-xs"
                      }`}
                    >
                      {album.name}
                    </h2>
                    <p className="text-sm">
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
        <section className="mt-10">
          <h1 className="ml-2 lg:ml-0 text-xl lg:text-left lg:text-3xl text-warning font-cinzel">
            músicas
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md">
            <ul className="carousel gap-4">
              {target?.musics.map((music, index) => (
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
                      className={`text-warning ${
                        music.name.length > 20 && "text-xs"
                      }`}
                    >
                      {music.name}
                    </h2>
                    <p
                      className={`text-sm ${
                        music.artist.length > 1 && "text-xs"
                      }`}
                    >
                      {music.artist.map((artist, i, arr) => {
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
