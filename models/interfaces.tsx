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
}

export interface CoverImg {
  sm: string;
  md: string;
  lg: string;
}
