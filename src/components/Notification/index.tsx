import React, { useState, useEffect } from "react";
import { useUser } from "../../../utils/Hooks";

export const TopNotification: React.FC = () => {
  const { data } = useUser();
  const [width, setWidth] = useState(100);
  const [trigger, setTrigger] = useState(false);
  const divWidth = `${String(width)}%`;

  const onTimeOut = (stop: boolean) => {
    const interval = setInterval(() => {
      setWidth((prev) => prev - 10);
    }, 1000);

    if (stop) {
      clearInterval(interval);
    }
  };

  /*  setTimeout(() => {
    const interval = setInterval(() => {
      setWidth((prev) => prev - 10);
    }, 1000);
  }, 10000); */

  /*   useEffect(() => {
    if (trigger) {
      onTimeOut();
    } else {
      clearInterval(interval);
      setWidth(100);
    }
  }, [trigger]); */

  console.log(width);

  return (
    <div className={`fixed top-8 w-full z-10 text-center`}>
      <div className="p-4 rounded-md w-5/6 m-auto text-gray-300 bg-dark-600 border border-danube">
        <div className="relative">
          <div
            className={`rounded-md bg-danube p-1 absolute`}
            style={{ width: divWidth }}
          ></div>
          <div className="w-full rounded-md bg-led p-1"></div>
        </div>
        <p>fixed bottomfixed bottomfixed bottomfixed bottomfixed bottom</p>
        <button className="btn btn-sm" onClick={() => setTrigger(!trigger)}>
          Trigger
        </button>
      </div>
    </div>
  );
};
