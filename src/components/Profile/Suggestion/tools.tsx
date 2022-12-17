import {
  Albums,
  Music,
  Profile,
  Suggestion,
} from "../../../../models/interfaces";

interface SuggestionTools {
  rate?: {
    selected: number;
    setError: (data: string) => void;
    setSuccess: (data: string) => void;
    setStep: (data: number) => void;
    user: Profile;
    step: number;
    result: Suggestion;
    mutate: (data: any) => void;
    sendNotification: any;
  };

  add?: {
    user: Profile;
    mutate: (data: any) => void;
    result: Suggestion;
    setSuccess: (data: string) => void;
  };
}

export const addSuggestion = ({ add }: SuggestionTools) => {
  const { user, result, mutate, setSuccess } = add!;
  switch (result.type) {
    case "track":
      const song: Music = {
        id: result.id,
        artist: result.artist,
        cover: result.cover,
        name: result.name,
      };
      let songs: Music[] = [...user.musics, song];

      const payload = {
        id: user.id,
        body: { musics: songs },
      };

      try {
        mutate(payload);
        setSuccess("Música adicionada");
      } catch (error) {
        throw new Error();
      }

      break;

    case "album":
      const album: Albums = {
        id: result.id,
        artist: result.artist,
        cover: result.cover,
        name: result.name,
      };
      let albums: Albums[] = [...user.albums, album];

      const albumPayload = {
        id: user.id,
        body: { albums },
      };

      try {
        mutate(albumPayload);
        setSuccess("Álbum adicionado");
      } catch (error) {
        throw new Error();
      }

      break;

    default:
      break;
  }
};

export const rateSuggestion = ({ rate }: SuggestionTools) => {
  const {
    selected,
    setError,
    step,
    result,
    mutate,
    user,
    setStep,
    setSuccess,
    sendNotification,
  } = rate!;
  if (!selected) {
    setError("Você deve selecionar uma das opções");
    return;
  }

  const addParams = { user, result, mutate, setSuccess };

  if (step == 1) {
    try {
      const userSuggestions: Suggestion[] = user.suggestions.map((item) => {
        return item.id == result.id ? { ...item, rate: selected } : item;
      });

      const payload = {
        id: user.id,
        body: { suggestions: userSuggestions },
      };

      const notificationPayload = {
        sent_to: result.sent_by,
        sent_by: user.id,
        seen: false,
        content: "Avaliou sua sugestão",
        created_at: new Date().getTime(),
        type: "suggestion",
      };

      mutate(payload);
      sendNotification.mutate(notificationPayload);
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      return;
    }
    setStep(2);
    return;
  }

  try {
    addSuggestion({ add: addParams });
    const closeBtn = document.getElementById(
      "general-modal"
    ) as HTMLLabelElement;
    closeBtn.click();
  } catch (error) {
    setError("Houve algum erro, tente novamente");
    return;
  }
};
