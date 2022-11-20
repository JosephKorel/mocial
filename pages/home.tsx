import type { NextPage } from "next";
import { useRouter } from "next/router";
import { HomePageProps } from "../models/interfaces";
import { useQueryData } from "../utils/Hooks";

const Home: NextPage<HomePageProps> = () => {
  const router = useRouter();
  const { user, profiles } = useQueryData(["user", "profiles"]);
  const users = profiles.filter((item) => item.id != user?.id);

  return (
    <div className="font-kanit">
      <header></header>
      <main className="mt-2">
        <section>
          <article className="px-2">
            <ul className="flex items-center">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="avatar"
                  onClick={() => {
                    router.push({
                      pathname: "/[seeUser]",
                      query: { seeUser: user.id },
                    });
                  }}
                >
                  <div className="w-14 rounded-full">
                    <img src={user.avatar_url}></img>
                  </div>
                  <label
                    htmlFor="my-modal"
                    className="modal-button absolute z-10 w-14 opacity-0 h-14 rounded-full"
                  >
                    open
                  </label>
                </li>
              ))}
            </ul>
          </article>
        </section>
        <input type="checkbox" id="my-modal" className="modal-toggle" />
      </main>
    </div>
  );
};

export default Home;
