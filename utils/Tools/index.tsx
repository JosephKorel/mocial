import { Albums, CoverImg, Music } from "../../models/interfaces";

export const formatMusic = (data: any[]) => {
  let musics: Music[] = [];
  if (!data) return [];
  data.forEach((item: any) => {
    let artists: string[] = [];
    const coverImg: CoverImg = {
      sm: item.album.images[2].url,
      md: item.album.images[1].url,
      lg: item.album.images[0].url,
    };

    item.artists.forEach((artist: any) => artists.push(artist.name));
    const music = {
      id: item.id,
      name: item.name,
      artist: artists,
      cover: coverImg,
    };

    musics.push(music);
  });

  return musics;
};

export const formatAlbums = (data: any[]) => {
  let albums: Albums[] = [];
  if (!data) return [];
  data.forEach((item: any) => {
    let artists: string[] = [];
    const coverImg: CoverImg = {
      sm: item.images[2].url,
      md: item.images[1].url,
      lg: item.images[0].url,
    };

    item.artists.forEach((artist: any) => artists.push(artist.name));

    const album = {
      id: item.id,
      name: item.name,
      artist: artists,
      cover: coverImg,
    };

    albums.push(album);
  });

  return albums;
};
