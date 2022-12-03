import { Music, Profile, Suggestion } from "../../../../models/interfaces";

interface HandleSelect {
  choice: Music;
  user: Profile;
  option: number;
  selected: Suggestion[];
  setSelected: (data: Suggestion[]) => void;
  setError: (data: string) => void;
}

interface HandleSuggestion {
  selected: Suggestion[];
  setError: (data: string) => void;
  setSuccess: (data: string) => void;
  mutate: (data: any) => void;
  targetId: string;
}

export const handleSelect = (params: HandleSelect) => {
  const { choice, option, selected, setError, setSelected, user } = params;
  const isSelected = selected.filter((item) => item.id == choice.id);

  if (isSelected.length) {
    const onFilter = selected.filter((item) => item.id != choice.id);
    setSelected(onFilter);
    return;
  }

  if (selected.length == 3) {
    setError(
      `Você só pode sugerir até três ${option == 1 ? "álbuns" : "músicas"}`
    );

    return;
  }

  setSelected([
    ...selected,
    {
      ...choice,
      sent_by: user.id,
      type: option == 1 ? "album" : "track",
    },
  ]);

  return;
};

export const handleSuggestion = (params: HandleSuggestion) => {
  const { targetId, selected, setError, setSuccess, mutate } = params;
  const payload = {
    id: targetId,
    body: { suggestions: selected },
  };
  try {
    mutate(payload);

    const closeBtn = document.getElementById(
      "closeSuggestModal"
    ) as HTMLLabelElement;
    closeBtn.click();
    setSuccess("Sugestões enviadas!");
  } catch (error) {
    setError("Houve algum erro, tente novamente");
    console.log(error);
  }
};
