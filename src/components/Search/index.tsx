import { useRouter } from "next/router";
import { Post, Profile } from "../../../models/interfaces";
import { getArtist } from "../../../utils/Tools";

export const RenderUser = ({ user }: { user: Profile }) => {
  const router = useRouter();
  return (
    <li
      className="flex gap-2 items-start rounded-md p-2 bg-dark shadow-sm shadow-black"
      onClick={() =>
        router.push({
          pathname: "/[seeUser]",
          query: { seeUser: user.id },
        })
      }
    >
      <div className="avatar">
        <div className="w-8 border-2 border-primary rounded-full">
          <img src={user.avatar_url} alt={user.username}></img>
        </div>
      </div>
      <h1 className="flex-1">{user.username}</h1>
    </li>
  );
};

export const RenderPost = ({ post }: { post: Post }) => {
  const router = useRouter();
  const { cover, name, artist } = post.subject;
  return (
    <li
      className="flex gap-2 items-start rounded-md p-2 bg-dark shadow-sm shadow-black"
      onClick={() => {
        router.push({ pathname: "/Posts/[id]", query: { id: post.id } });
      }}
    >
      <div className="avatar">
        <div className="w-8 border-2 border-primary rounded-full">
          <img src={cover.sm} alt={name}></img>
        </div>
      </div>
      <div className="flex-1 self-start">
        <h1 className={`leading-3 ${post.title.length > 24 && "text-sm"}`}>
          {post.title}
        </h1>
        <span className="text-gray-500 text-sm">
          {getArtist(artist)} - {name}
        </span>
      </div>
    </li>
  );
};
