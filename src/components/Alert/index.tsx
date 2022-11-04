import { AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import { useAuthContext } from "../../context";
import React, { useEffect } from "react";

export const Alert: React.FC = () => {
  const { success, error, setSuccess, setError } = useAuthContext();
  useEffect(() => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  }, [success, error]);

  return (
    <div
      className={
        success.length || error.length
          ? "absolute bottom-10 w-full z-[999] text-center fadein"
          : "hidden"
      }
    >
      <div
        className={`w-11/12 text-sm lg:text-base lg:w-1/2 m-auto alert ${
          error ? "alert-error" : "alert-success"
        } shadow-lg`}
      >
        <div className="flex items-center gap-1">
          {error && <AiOutlineWarning />}
          {success && <AiOutlineInfoCircle />}
          <p>
            {success} {error}
          </p>
        </div>
      </div>
    </div>
  );
};
