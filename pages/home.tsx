import { Session } from "@supabase/supabase-js";
import type { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../src/context";
import { HomePageProps, Profile } from "../models/interfaces";
import UserProfile from "../src/components/Profile";
import { useProfiles, useUser } from "../utils/Hooks";

const Home: NextPage<HomePageProps> = () => {
  const router = useRouter();
  const { user, profiles } = useAuthContext();
  const users = profiles.filter((item) => item.id != user?.id);
  const { isLoading, data } = useProfiles();
  const { data: myUser } = useUser();
  const allusers = isLoading ? [] : (data as Profile[]);

  return (
    <div className="font-kanit">
      <header></header>
      <main className="mt-2">
        <section>
          <article className="px-2">
            {isLoading ? (
              <></>
            ) : (
              <>
                <ul className="flex items-center">
                  {allusers.map((user, index) => (
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
              </>
            )}
          </article>
        </section>
        <input type="checkbox" id="my-modal" className="modal-toggle" />
      </main>
    </div>
  );
};

export default Home;
