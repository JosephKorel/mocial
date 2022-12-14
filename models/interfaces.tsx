export type HomePageProps = {
  profiles: Profile[];
  user: Profile;
};

export interface Profile {
  id: string;
  username: string;
  description: string;
  avatar_url: string;
  genres: string[];
  musics: Music[];
  albums: Albums[];
  following: string[];
  followers: string[];
  listen_later: ListenLater[];
  updated_at: Date;
  background: string;
  suggestions: Suggestion[];
}

export interface Music {
  id: string;
  name: string;
  artist: string[];
  cover: CoverImg;
  type?: string;
}

export interface Albums {
  id: string;
  name: string;
  artist: string[];
  cover: CoverImg;
  type?: string;
}

export interface Suggestion {
  id: string;
  name: string;
  artist: string[];
  cover: CoverImg;
  type: string;
  sent_by?: string;
  sent_at?: Date;
  rate?: number;
}

export interface ListenLater {
  id: string;
  name: string;
  artist: string[];
  cover: CoverImg;
  type: string;
  added_at: number;
  listened: boolean;
}

export interface CoverImg {
  sm: string;
  md: string;
  lg: string;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  liked_by: string[];
  created_at: number;
}

export interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  type: string;
  subject: Music;
  created_at: number;
  updated_at: number;
  profiles?: Profile;
  liked_by: string[];
  comments: Comment[];
}

export interface MutationPayload {
  id: number;
  body: any;
  option: string;
}
