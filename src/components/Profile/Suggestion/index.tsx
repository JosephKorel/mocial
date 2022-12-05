import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBackLine } from "react-icons/ri";
import { Suggestion } from "../../../../models/interfaces";
import { useQueryData, useUserUpdate } from "../../../../utils/Hooks";
import { GrStar } from "react-icons/gr";
import { RateBadge, RateSuggestion } from "./components";

export const RenderSuggestions = ({
  result,
  setSuggestion,
  setChildren,
}: {
  result: Suggestion;
  setSuggestion: (data: Suggestion) => void;
  setChildren: (data: React.ReactNode) => void;
}) => {
  const { profiles } = useQueryData(["profiles"]);

  const sentBy = (id: string) => {
    const [user] = profiles.filter((item) => item.id == id);

    return user.username;
  };

  return (
    <li className="w-full mt-2 m-auto relative cursor-pointer bg-dark duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg">
      <div className=" flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <img
            src={result.cover.sm}
            className="rounded-full w-12 lg:w-auto"
          ></img>
          <div className="flex flex-col self-start">
            <p
              className={`lg:text-lg ${
                result.name.length > 25 ? "text-sm" : "text-base"
              }`}
            >
              {result.name}
            </p>
            <p className="font-thin text-gray-400 text-sm">
              {result.artist.map((obj, i, arr) => {
                return i == arr.length - 1 ? obj : obj + ", ";
              })}
            </p>
          </div>
        </div>
        <div className="dropdown dropdown-end self-start">
          <button
            tabIndex={0}
            className="p-1 px-2 rounded-md bg-dark-600 text-gray-100"
          >
            <BsThreeDots />
          </button>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content text-gray-300 shadow bg-base-200 rounded-md w-60"
          >
            <li>
              {result.rate ? (
                <label className="text-gray-500">
                  <GrStar />
                  Avaliar {result.type == "track" ? "música" : "álbum"}
                </label>
              ) : (
                <label
                  htmlFor="general-modal"
                  onClick={() =>
                    setChildren(<RateSuggestion result={result} />)
                  }
                >
                  <GrStar />
                  Avaliar {result.type == "track" ? "música" : "álbum"}
                </label>
              )}
            </li>
            <li>
              <label
                htmlFor="confirm-modal"
                onClick={() => setSuggestion(result)}
              >
                <RiDeleteBackLine /> Remover
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <RateBadge rate={result.rate!} />
        <p className="text-sm font-light text-gray-100">
          sugerido por{" "}
          <span className="font-medium text-danube">
            {sentBy(result.sent_by!)}
          </span>
        </p>
      </div>
    </li>
  );
};
