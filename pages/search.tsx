import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import { useAuthContext } from "../src/context";

const Search: NextPage = () => {
  const { user, profiles } = useAuthContext();
  const [name, setName] = useState("");
  const router = useRouter();
  const users = profiles.filter((item) => item.id != user?.id);
  const searchResults = name.length
    ? users.filter((item) =>
        item.username.toLowerCase().includes(name.toLowerCase())
      )
    : [];

  return (
    <div className="font-kanit">
      <header className="w-11/12 m-auto mt-4 relative">
        <div className="w-full bg-danube p-[2px] rounded-lg absolute left-0 top-4 z-0"></div>
        <h1 className="text-2xl text-gray-200 font-thin rounded-full bg-dark-600 m-auto w-fit px-3 relative z-10">
          Procurar usuário
        </h1>
        <form className="form-control mt-2">
          <div className="input-group">
            <input
              placeholder="Procurar usuário"
              className="input input-primary input-ghost input-sm w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-sm btn-square btn-primary">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </header>
      <main className="w-11/12 m-auto mt-4">
        <article className="h-[30rem] px-3 py-2 bg-dark rounded-md ">
          <ul className="flex flex-col gap-2">
            {searchResults.map((profile, index) => (
              <li
                className="flex justify-between items-start rounded-xl p-2 bg-dark-600 shadow-sm shadow-black"
                key={index}
              >
                <div className="avatar">
                  <div className="w-8 border-2 border-primary rounded-full">
                    <img src={profile.avatar_url} alt={profile.username}></img>
                  </div>
                </div>
                <p className="pl-2 flex-1">{profile.username}</p>
                <button
                  className="btn btn-xs btn-ghost text-primary self-start font-normal gap-1"
                  onClick={() =>
                    router.push({
                      pathname: "/[seeUser]",
                      query: { seeUser: profile.id },
                    })
                  }
                >
                  <BsBoxArrowInUpRight />
                  Perfil
                </button>
              </li>
            ))}
          </ul>
        </article>
      </main>
    </div>
  );
};

export default Search;
