import { useRouter } from "next/router";
import { GoHome, GoSearch } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
import { useAuthContext } from "../../context";

export const BottomNav: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  return (
    <div
      className={
        user == null ? "hidden" : "fixed bottom-2 w-full z-10 text-center"
      }
    >
      <ul className="w-2/3 flex justify-between m-auto menu menu-horizontal bg-base-200 rounded-box text-primary">
        <li className="">
          <a onClick={() => router.push("/home")}>
            <GoHome />
          </a>
        </li>
        <li className="">
          <a onClick={() => router.push("/home")}>
            <GoSearch />
          </a>
        </li>
        <li className="">
          <a onClick={() => router.push("/profile")}>
            <MdOutlinePersonPin />
          </a>
        </li>
      </ul>
    </div>
  );
};
