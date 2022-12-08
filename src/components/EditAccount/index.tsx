import React, { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { Profile } from "../../../models/interfaces";
import { useUser } from "../../../utils/Hooks";

export const EditAccountHeader = () => {
  const { data } = useUser();
  if (!data) {
    return <div></div>;
  }

  const user = data as Profile;
  const [username, setUsername] = useState(user.username);
  const [editName, setEditName] = useState(false);

  return (
    <div>
      <header className="py-4 px-2">
        <div className="flex flex-col items-center gap-4">
          <div className="avatar relative z-10">
            <div className="w-20 rounded-full border-4 border-danube">
              <img
                src={user.avatar_url}
                alt={user.username}
                referrerPolicy="no-referrer"
              ></img>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center">
              <input
                className="bg-inherit relative block rounded-md w-full text-center border border-transparent placeholder-gray-400 text-gray-300 text-lg focus:outline-none focus:ring-danube focus:border-danube"
                disabled={!editName}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
              <div className="absolute right-4">
                {editName ? (
                  <></>
                ) : (
                  <RiEdit2Line
                    className="text-danube"
                    onClick={() => setEditName(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
