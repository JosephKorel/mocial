import { ListenLater, Music, Profile } from "../../../models/interfaces";

interface AddParams {
  type: string;
  user: Profile;
  mutate: (data: any) => void;
  media: Music;
  setError: (data: string) => void;
  setSuccess: (data: string) => void;
}

export const handleAdd = (params: AddParams) => {
  const { type, user, mutate, setError, media, setSuccess } = params;
  const closeBtn = document.getElementById("closeModal");
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
  } catch (error) {
    setError("Houve algum erro, tente novamente");
  }
};

export const addToListenLater = (params: AddParams) => {
  const { type, user, mutate, setError, media, setSuccess } = params;
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
  } catch (error) {
    setError("Houve algum erro, tente novamente");
  }
};
