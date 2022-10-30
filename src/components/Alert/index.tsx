import { AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";

export const Alert: React.FC<{ success: string; error: string }> = ({
  success,
  error,
}) => {
  return (
    <div
      className={
        success.length || error.length
          ? "absolute bottom-10 w-full z-10 text-center fadein"
          : "hidden"
      }
    >
      <div
        className={`w-11/12 text-sm lg:text-base lg:w-1/2 m-auto alert ${
          error ? "alert-error" : "alert-success"
        } shadow-lg`}
      >
        <div className="flex items-center gap-2">
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
