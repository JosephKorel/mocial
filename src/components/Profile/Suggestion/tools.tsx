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
  };

  add?: {
    user: Profile;
    mutate: (data: any) => void;
    result: Suggestion;
  };
}

export const addSuggestion = ({ add }: SuggestionTools) => {
  const { user, result, mutate } = add!;
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
        body: { musics: albums },
      };

      try {
        mutate(albumPayload);
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
  } = rate!;
  if (!selected) {
    setError("Você deve selecionar uma das opções");
    return;
  }

  const addParams = { user, result, mutate };

  if (step == 1) {
    try {
      const userSuggestions: Suggestion[] = user.suggestions.map((item) => {
        return item.id == result.id ? { ...item, rate: selected } : item;
      });

      const payload = {
        id: user.id,
        body: { suggestions: userSuggestions },
      };

      mutate(payload);
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      return;
    }
    setStep(2);
    return;
  }

  try {
    addSuggestion({ add: addParams });
    setSuccess("Música adicionada");
    const closeBtn = document.getElementById(
      "general-modal"
    ) as HTMLLabelElement;
    closeBtn.click();
  } catch (error) {
    setError("Houve algum erro, tente novamente");
    return;
  }
};
