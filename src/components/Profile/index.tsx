import { Profile } from "../../../models/interfaces";

interface UserProfileProps {
  user: Profile | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="font-kanit">
      <header className="w-full">
        <div className="flex flex-col items-center gap-0">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={user?.avatar_url}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className=""
              ></img>
            </div>
          </div>
          <h2 className="text-gray-100 text-lg font-light">{user?.username}</h2>
        </div>
      </header>
      <main className="mt-5 lg:mt-10 lg:px-5 w-full">
        <section>
          <h1 className="ml-2 lg:ml-0 text-xl lg:text-left lg:text-3xl text-warning font-cinzel">
            álbuns
          </h1>
          <article className="p-2 lg:py-7 lg:px-5 bg-dark rounded-md w-full">
            <ul className="carousel gap-2">
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
            <ul className="carousel gap-2">
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
