import { Comment, Post, Profile } from "../../../../models/interfaces";

interface LikePost {
  post: Post;
  user: Profile;
  mutate: (data: any) => void;
  setError: (data: string) => void;
}

interface CommentPost {
  content: string;
  setContent: (data: string) => void;
  user: Profile;
  mutate: (data: any) => void;
  setError: (data: string) => void;
  post: Post;
}

interface LikeComment {
  user: Profile;
  mutate: (data: any) => void;
  comment: Comment;
  hasLiked: boolean;
  setError: (data: string) => void;
  post: Post;
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

export const handleComment = (params: CommentPost) => {
  const { content, user, post, mutate, setError, setContent } = params;
  if (!content) {
    return;
  }
  const comment: Comment = {
    id: post.comments.length + 1,
    author: user.id,
    content,
    created_at: new Date().getTime(),
    liked_by: [],
  };

  const body = { comments: [...post.comments, comment] };

  const payload = {
    id: post.id,
    body,
  };

  try {
    mutate(payload);
    setContent("");
  } catch (error) {
    setError("Houve algum erro, tente novamente");
    console.log(error);
  }
};

export const handleCommentLike = (params: LikeComment) => {
  const { post, comment, mutate, setError, user, hasLiked } = params;
  let payload = {
    id: post.id,
    body: {},
  };

  if (hasLiked) {
    const unlike = comment.liked_by.filter((item) => item != user.id);
    const commentMap = post.comments.map((item) => {
      if (item.id != comment.id) return item;

      return { ...item, liked_by: unlike };
    });

    try {
      payload = { ...payload, body: { comments: commentMap } };
      mutate(payload);
    } catch (error) {
      setError("Houve algum erro, tente novamente");
    }

    return;
  }

  const addLike = [...comment.liked_by, user.id];
  const commentMap = post.comments.map((item) => {
    if (item.id != comment.id) return item;

    return { ...item, liked_by: addLike };
  });

  payload = { ...payload, body: { comments: commentMap } };

  try {
    mutate(payload);
  } catch (error) {
    setError("Houve algum erro, tente novamente");
    console.log(error);
  }
};
