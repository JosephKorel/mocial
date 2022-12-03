export type HomePageProps = {
  profiles: Profile[];
  user: Profile;
};

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  genres: string[];
  musics: Music[];
  albums: Albums[];
  following: string[];
  followers: string[];
  updated_at: Date;
  background: string;
  suggestions: Suggestion[];
}

export interface Music {
  id: string;
  name: string;
  artist: string[];
  cover: CoverImg;
}

export interface Albums {
  id: string;
  name: string;
  artist: string[];
  cover: CoverImg;
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

export interface CoverImg {
  sm: string;
  md: string;
  lg: string;
}

export interface Comment {
  author: string;
  content: string;
  liked_by: string[];
  created_at: Date;
}

export interface Post {
  id?: number;
  author: string;
  title: string;
  content: string;
  type: string;
  subject: Music;
  created_at?: string;
  profiles?: Profile;
  liked_by: string[];
  comments: Comment[];
}
