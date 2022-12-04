import { Albums, CoverImg, Music, Profile } from "../../models/interfaces";
import moment from "moment";

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

export const getArtist = (artist: string[]) => {
  return artist.map((item, index, arr) => (
    <>
      {item}
      {index == arr.length - 1 ? "" : ", "}
    </>
  ));
};

export const getDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

export const getDateDifference = (date: number) => {
  const today = moment();
  const compareDate = moment(date);
  const difference = today.diff(compareDate);

  if (difference < 60000) {
    const getDif = today.diff(compareDate, "seconds");
    return getDif + "s";
  }

  if (difference < 3600000) {
    const getDif = today.diff(compareDate, "minutes");
    return getDif + "m";
  }

  if (difference < 24 * 3600000) {
    const getDif = today.diff(compareDate, "hours");
    return getDif + "h";
  }

  if (difference < 24 * 7 * 3600000) {
    const getDif = today.diff(compareDate, "days");
    return getDif + "d";
  }

  if (difference < 24 * 7 * 3600000 * 4) {
    const getDif = today.diff(compareDate, "weeks");
    return getDif + "s";
  }
  if (difference < 24 * 7 * 3600000 * 4 * 12) {
    const getDif = today.diff(compareDate, "months");
    return getDif + "m";
  }

  if (difference > 24 * 7 * 3600000 * 4 * 12) {
    const getDif = today.diff(compareDate, "years");
    return getDif + "a";
  }
};

export const getProfile = (profiles: Profile[], id: string) => {
  const onFilter = profiles.filter((item) => item.id == id);
  return onFilter[0];
};
