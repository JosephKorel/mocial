import {
  deleteAvatar,
  getAvatarUrl,
  uploadAvatar,
} from "../../../pages/api/query-tools";

interface UpdateAvatar {
  e: React.ChangeEvent<HTMLInputElement>;
  avatar_url: string;
  id: string;
  mutate: (data: any) => void;
  setError: (data: string) => void;
}

interface EditName {
  username: string;
  id: string;
  mutate: (data: any) => void;
  setError: (data: string) => void;
  setEditName: (data: boolean) => void;
}

export const getFilePath = (avatar_url: string) => {
  const onSplit = avatar_url.split("/");
  const [url] = onSplit.slice(-1);
  return url;
};

export const handleAvatarUpdate = async (params: UpdateAvatar) => {
  const { avatar_url, id, mutate, e, setError } = params;
  const path = getFilePath(avatar_url);
  const file = e.currentTarget.files?.[0];
  if (file) {
    await deleteAvatar(path);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      await uploadAvatar(fileName, file);
      const publicUrl = getAvatarUrl(fileName);
      const payload = {
        id,
        body: { avatar_url: publicUrl },
      };
      mutate(payload);
    } catch (error) {
      setError("Houve algum erro, tente novamente");
    }
    return;
  }
  setError("Você deve escolher um arquivo");
};

export const handleNameEdit = (params: EditName) => {
  const { username, setError, id, mutate, setEditName } = params;
  if (!username) {
    setError("Seu nome deve ter pelo menos 3 caracteres");
    return;
  }

  if (username.length > 16) {
    setError("Seu nome não pode ter mais que 16 caracteres");
    return;
  }

  const payload = {
    id,
    body: { username },
  };

  try {
    mutate(payload);
  } catch (error) {
    console.log(error);
  }

  setEditName(false);
};
