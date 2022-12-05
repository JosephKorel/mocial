import { useState } from "react";
import { NextPage } from "next";
import { AiOutlineSearch } from "react-icons/ai";
import { useQueryData } from "../utils/Hooks";
import { Post, Profile } from "../models/interfaces";
import ProtectedRoute from "../src/components/Protector";
import { RenderPost, RenderUser } from "../src/components/Search";
import { handleSearch } from "../src/components/Search/tools";

const Search: NextPage = () => {
  const { user, profiles, posts } = useQueryData(["user", "profiles", "posts"]);
  const [search, setSearch] = useState("");
  const users = profiles.filter((item) => item.id != user.id);

  const itemType = (item: Post | Profile) => {
    return typeof item.id == "string"
      ? { profile: item as Post }
      : { post: item as Profile };
  };

  const searchResults = search.length ? handleSearch(users, posts, search) : [];

  return (
    <ProtectedRoute>
      <div className="font-kanit">
        <header className="w-11/12 m-auto mt-4 relative">
          <div className="w-full bg-danube p-[1px] rounded-lg absolute left-0 top-4 z-0"></div>
          <h1 className="text-2xl text-gray-200 font-semibold rounded-full bg-dark-600 m-auto w-fit px-3 relative z-10">
            Pesquisar
          </h1>
          <form className="form-control mt-2">
            <div className="bg-dark rounded-lg flex justify-between items-center relative">
              <input
                placeholder="Procurar usuários, publicações..."
                className="bg-inherit relative block rounded-md w-full px-3 pl-8 py-2 border border-gray-400 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <AiOutlineSearch
                className={`absolute left-2 text-lg ${
                  search.length ? "text-danube" : "text-gray-400"
                }`}
              />
            </div>
          </form>
        </header>
        <main className="w-11/12 m-auto mt-4">
          <article className="h-[30rem] px-3 py-2 bg-dark rounded-md ">
            <ul className="flex flex-col gap-2">
              {searchResults.map((item, index) =>
                itemType(item).profile ? (
                  <RenderUser user={item as Profile} key={index} />
                ) : (
                  <RenderPost post={item as Post} key={index} />
                )
              )}
            </ul>
          </article>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Search;
