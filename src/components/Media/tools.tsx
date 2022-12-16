import moment from "moment";
import {
  Albums,
  ListenLater,
  Music,
  Profile,
} from "../../../models/interfaces";

interface AddParams {
  type: string;
  user: Profile;
  mutate: (data: any) => void;
  media: Music;
  setError: (data: string) => void;
  setSuccess: (data: string) => void;
  setElement: (data: JSX.Element | null) => void;
}

export const handleAdd = (params: AddParams) => {
  const { type, user, mutate, setError, media, setSuccess, setElement } =
    params;
  const closeBtn = document.getElementById("closeTransparentModal");
  if (type == "album") {
    const isCommon = user.albums.filter((item) => item.id == media.id);

    if (isCommon.length) {
      setError("Você já tem este álbum salvo em sua biblioteca");
      return;
    }

    const addAlbum = [...user.albums, media];
    const payload = {
      id: user.id,
      body: { albums: addAlbum },
    };
    try {
      mutate(payload);
      closeBtn?.click();
      setSuccess("Álbum adicionado");
      /* setElement!(null); */
    } catch (error) {
      setError("Houve algum erro, tente novamente");
    }
    return;
  }
  const addMusic = [...user.musics, media];
  const payload = {
    id: user.id,
    body: { musics: addMusic },
  };
  try {
    mutate(payload);
    closeBtn?.click();
    setSuccess("Música adicionada");
    /* setElement!(null); */
  } catch (error) {
    setError("Houve algum erro, tente novamente");
  }
};

export const addToListenLater = (params: AddParams) => {
  const { type, user, mutate, setError, media, setSuccess, setElement } =
    params;
  const closeBtn = document.getElementById("closeModal");
  const hasAdded = user.listen_later.filter((item) => item.id == media.id);
  if (hasAdded.length) {
    const message =
      media.type == "album"
        ? "Você já tem este álbum adicionado"
        : "Você já tem esta música adicionada";
    setError(message);
    return;
  }

  const selected: ListenLater = {
    ...media,
    type,
    added_at: new Date().getTime(),
    listened: false,
  };
  const addMedia: ListenLater[] = [...user.listen_later, selected];
  const payload = {
    id: user.id,
    body: { listen_later: addMedia },
  };
  try {
    mutate(payload);
    closeBtn?.click();
    setSuccess("Adicionado");
    setElement!(null);
  } catch (error) {
    setError("Houve algum erro, tente novamente");
  }
};

export const getTotalDuration = (type: string, data: any) => {
  if (type == "album") {
    let duration_ms = 0;
    const tracks: any[] = data.tracks.items;
    tracks.forEach((track) => (duration_ms += track.duration_ms));
    const duration_s = duration_ms / 1000;
    const duration_min = duration_s / 60;
    if (duration_min < 60) {
      return `${Math.round(duration_min)} minutos`;
    }

    const duration_hr = Math.round(duration_min / 60);
    const minutes = Math.round((duration_min / 60 - duration_hr) * 60);
    return `${duration_hr} ${duration_hr > 1 ? "horas" : "hora"} e ${minutes} ${
      minutes > 1 ? "minutos" : "minuto"
    }`;
  }

  const duration_min = data.duration_ms / 1000 / 60;
  const duration_s = data.duration_ms / 1000;
  if (duration_min < 1) {
    const seconds = data.duration_ms / 1000;
    return `${seconds} segundos`;
  }

  const minutes = Math.floor(duration_min);
  const seconds = Math.floor(duration_s % 60);

  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

export const getInfo = (data: any, media: Albums) => {
  if (!data) {
    return { release_date: "", duration_min: "", link: "", total_tracks: "" };
  }

  const link = data.href;

  if (media.type == "album") {
    const release_date = moment(data.release_date, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    );
    const total_tracks = data.total_tracks;
    const duration_min = getTotalDuration("album", data);

    const additionalInfo = {
      release_date,
      total_tracks,
      duration_min,
      link,
    };
    return additionalInfo;
  }

  const release_date = moment(data.album.release_date, "YYYY-MM-DD").format(
    "DD/MM/YYYY"
  );

  const duration_min = getTotalDuration("music", data);

  const additionalInfo = {
    release_date,
    duration_min,
    total_tracks: "",
    link,
  };
  return additionalInfo;
};
