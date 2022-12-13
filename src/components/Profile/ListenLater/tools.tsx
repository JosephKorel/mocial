import {
  Albums,
  ListenLater,
  Music,
  Profile,
} from "../../../../models/interfaces";

interface CheckParams {
  user: Profile;
  mutate: (data: any) => void;
  media: ListenLater;
  setError: (data: string) => void;
  setSuccess?: (data: string) => void;
}

export const checkListened = (params: CheckParams) => {
  const { media, user, mutate, setError } = params;
  if (media.listened) {
    return;
  }

  const checkMedia = user.listen_later.map((item) => {
    if (item.id != media.id) return item;

    return { ...item, listened: true };
  });

  const payload = {
    id: user.id,
    body: { listen_later: checkMedia },
  };

  try {
    mutate(payload);
  } catch (error) {
    console.log(error);
    setError("Houve algum erro, tente novamente");
  }
};

export const handleAdd = (params: CheckParams) => {
  const { media, user, mutate, setError, setSuccess } = params;
  const hasAdded = user.albums.filter((item) => item.id == media.id);
  if (hasAdded.length) {
    const message =
      media.type == "album"
        ? "Você já tem este álbum salvo em sua biblioteca"
        : "Você já tem esta música salva em sua biblioteca";
    setError(message);
    return;
  }

  if (media.type == "album") {
    const selected: Albums = {
      id: media.id,
      name: media.name,
      artist: media.artist,
      cover: media.cover,
      type: media.type,
    };
    const addAlbum = [...user.albums, selected];
    const payload = {
      id: user.id,
      body: { albums: addAlbum },
    };
    try {
      mutate(payload);

      setSuccess!("Álbum adicionado");
    } catch (error) {
      setError("Houve algum erro, tente novamente");
    }
    return;
  }
  const selected: Music = {
    id: media.id,
    name: media.name,
    artist: media.artist,
    cover: media.cover,
    type: media.type,
  };
  const addMusic = [...user.musics, selected];
  const payload = {
    id: user.id,
    body: { musics: addMusic },
  };
  try {
    mutate(payload);
    setSuccess!("Música adicionada");
  } catch (error) {
    setError("Houve algum erro, tente novamente");
  }
};
