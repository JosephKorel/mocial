import { Comment, Post, Profile } from "../../../../models/interfaces";

export interface LikePost {
  post: Post;
  user: Profile;
  mutate: (data: any) => void;
  setError: (data: string) => void;
}

export interface CommentPost {
  content: string;
  setContent: (data: string) => void;
  user: Profile;
  mutate: (data: any) => void;
  setError: (data: string) => void;
  post: Post;
}

export interface LikeComment {
  user: Profile;
  mutate: (data: any) => void;
  comment: Comment;
  hasLiked: boolean;
  setError: (data: string) => void;
  post: Post;
}

export interface CommentFooterProps {
  setChildren: (data: JSX.Element) => void;
  comment: Comment;
  post: Post;
  hasLiked: boolean;
  handleLikeParams: LikeComment;
}
