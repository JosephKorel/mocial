import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useAuthContext } from "../../context";

export const TopNotification = ({
  children,
}: {
  children: JSX.Element | null;
}) => {
  const { notification, setNotification } = useAuthContext();

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 8000);
    }
  }, [notification]);

  return (
    <div
      className={`fixed top-2 right-2 w-5/6 z-[999] text-center font-kanit ${
        notification ? "slideleft" : "slideright"
      }`}
    >
      <div className="rounded-md bg-dark shadow-lg shadow-black">
        <div className="flex justify-end pr-1 pt-1">
          <AiOutlineClose
            className="text-lg text-gray-300"
            onClick={() => setNotification(null)}
          />
        </div>
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
};
