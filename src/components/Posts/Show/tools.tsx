import { Post, Profile } from "../../../../models/interfaces";

interface LikePost {
  post: Post;
  user: Profile;
  mutate: (data: any) => void;
  setError: (data: string) => void;
}

export const handleLike = (params: LikePost) => {
  const { post, user, mutate, setError } = params;
  const hasLiked = post.liked_by.includes(user.id);
  const removeLike = post.liked_by.filter((item) => item != user.id);
  const updatedLikes = hasLiked ? removeLike : [...post.liked_by, user.id];
  try {
    const body = { liked_by: updatedLikes };
    const payload = {
      id: post.id,
      body,
    };
    mutate(payload);
  } catch (error) {
    setError("Houve algum erro, tente novamente");
    console.log(error);
  }
};
