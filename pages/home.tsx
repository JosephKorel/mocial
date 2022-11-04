import { Session } from "@supabase/supabase-js";
import type { NextPage } from "next";
import { ReactNode, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../src/context";
import { HomePageProps, Profile } from "../models/interfaces";
import UserProfile from "../src/components/Profile";

const Home: NextPage<HomePageProps> = () => {
  const router = useRouter();
  const { user, profiles } = useAuthContext();
  const [seeUser, setSeeUser] = useState<Profile | null>(null);
  const users = profiles.filter((item) => item.id != user?.id);

  const UserModal = (): JSX.Element => {
    return (
      <div className="modal">
        <div className="modal-box pt-2 px-2">
          <UserProfile target={seeUser} setTarget={setSeeUser} />
        </div>
      </div>
    );
  };

  return (
    <div className="font-kanit">
      <header>
        {/* <nav className="p-2 px-4">
          <div className="flex justify-end items-center gap-4">
            <p
              onClick={() => router.push("/profile")}
              className="text-gray-100 duration-200 hover:text-warning cursor-pointer text-lg"
            >
              {user?.username}
            </p>
            <div className="avatar">
              <div className="w-10 rounded-full cursor-pointer">
                <img
                  src={user?.avatar_url}
                  onClick={() => router.push("/profile")}
                ></img>
              </div>
            </div>
          </div>
        </nav> */}
      </header>
      <main className="mt-2">
        <section>
          <article className="px-2">
            <ul className="flex items-center">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="avatar"
                  onClick={() => setSeeUser(user)}
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
        <UserModal />
      </main>
    </div>
  );
};

export default Home;

/* export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query as { id: string };

  const getProfiles = async () => {
    let { data, error, status } = await supabase.from("profiles").select();

    return data as Profile[];
  };

  const profiles = await getProfiles();

  return {
    props: { profiles, uid: id },
  };
}; */
