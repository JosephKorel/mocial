import { useRouter } from "next/router";
import { GoHome, GoSearch } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
import { useUser } from "../../../utils/Hooks";
import { IoCreateOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

export const BottomNav: React.FC = () => {
  const router = useRouter();
  const { data } = useUser();

  return (
    <div
      className={!data ? "hidden" : "fixed bottom-2 w-full z-10 text-center"}
    >
      <ul className="w-2/3 flex justify-between m-auto menu menu-horizontal bg-base-200 rounded-box text-danube">
        <li className="">
          <a onClick={() => router.push("/home")}>
            <GoHome />
          </a>
        </li>
        <li className="">
          <a onClick={() => router.push("/search")}>
            <GoSearch />
          </a>
        </li>
        <li className="">
          <a onClick={() => router.push("/Posts")}>
            <IoCreateOutline className="text-lg" />
          </a>
        </li>
        <li className="">
          <a onClick={() => router.push("notifications")}>
            <IoMdNotificationsOutline className="text-lg" />
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
