import { Albums, CoverImg, Music, Profile } from "../../models/interfaces";
import stringSimilarity from "string-similarity-js";
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

export const getDate = (date: number) => {
  return moment(date).format("DD/MM/YYYY");
};

export const getDateDifference = (date: number) => {
  const today = moment();
  const compareDate = moment(date);
  const difference = today.diff(compareDate);
  const dateFormat = moment(date).format("DD/MM/YYYY");

  if (difference < 60000) {
    return "há menos de um minuto";
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

  if (difference > 24 * 7 * 3600000 * 4) {
    return dateFormat;
  }

  /* if (difference < 24 * 7 * 3600000 * 4 * 12) {
    const getDif = today.diff(compareDate, "months");
    return getDif + "m";
  }

  if (difference > 24 * 7 * 3600000 * 4 * 12) {
    const getDif = today.diff(compareDate, "years");
    return getDif + "a";
  } */
};

export const getProfile = (profiles: Profile[], id: string) => {
  const onFilter = profiles.filter((item) => item.id == id);
  return onFilter[0];
};

export const getSimilarity = (first: string, second: string) => {
  const similarity = stringSimilarity(first, second);
  return similarity;
};

export const cardTitle = (name: string) => {
  return name.length > 16 ? name.slice(0, 14) + "..." : name;
};

export const artistName = (group: string[]) => {
  const letters = /^[A-Za-z]+$/;
  let artists = "";
  group.forEach((item, index, arr) => {
    index == arr.length - 1 ? (artists += item) : (artists += item + ", ");
  });

  if (!artists.match(letters)) {
    return artists.length > 12 ? artists.slice(0, 8) + "..." : artists;
  }

  return artists.length > 18 ? artists.slice(0, 12) + "..." : artists;
};
