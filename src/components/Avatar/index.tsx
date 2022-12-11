import { Profile } from "../../../models/interfaces";

interface Avatar {
  user: Profile;
  className?: string;
}

export const Avatar: React.FC<Avatar> = (props) => {
  const { user, className } = props;
  return (
    <div
      className={`${
        user.avatar_url ? "avatar" : "avatar placeholder"
      } relative z-10`}
    >
      <div
        className={` ${className} rounded-full  ${
          user.avatar_url ? "" : "bg-dark"
        }`}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            referrerPolicy="no-referrer"
          ></img>
        ) : (
          <span>{user.username.slice(0, 1)}</span>
        )}
      </div>
    </div>
  );
};
