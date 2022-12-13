import { Music, Profile } from "../../../../models/interfaces";
import { useQueryData, useUserUpdate } from "../../../../utils/Hooks";
import { useAuthContext } from "../../../context";

export const getFollowers = (
  target: Profile,
  profiles: Profile[]
): Profile[] => {
  if (!profiles) return [];

  const getProfiles = target.followers.reduce((acc, curr) => {
    const filter = profiles.filter((item) => item.id == curr);
    acc.push(filter[0]);
    return acc;
  }, [] as Profile[]);

  return getProfiles;
};

export const getFollowing = (
  target: Profile,
  profiles: Profile[]
): Profile[] => {
  if (!profiles) return [];

  const getProfiles = target.following.reduce((acc, curr) => {
    const filter = profiles.filter((item) => item.id == curr);
    acc.push(filter[0]);
    return acc;
  }, [] as Profile[]);

  return getProfiles;
};

interface HandleFollow {
  isFollowing: boolean;
  user: Profile;
  target: Profile;
  mutate: (data: any) => void;
}

export const handleFollow = async (params: HandleFollow): Promise<void> => {
  const { isFollowing, user, target, mutate } = params;
  if (isFollowing) {
    const onFilter = user.following.filter((item) => item != target.id);
    const onFollowerFilter = target.followers.filter(
      (item) => item != user?.id
    );
    try {
      const payload = [
        { ...user!, following: onFilter },
        { ...target!, followers: onFollowerFilter! },
      ];

      mutate(payload);
      return;
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  } else {
    const onFollow = [...user.following, target.id];
    const addFollower = [...target.followers, user.id];

    try {
      const payload = [
        { ...user!, following: onFollow },
        { ...target!, followers: addFollower },
      ];
      mutate(payload);

      return;
    } catch (error: any) {
      console.log(error);
    }
  }
};

export const AddToMyLibrary = ({
  type,
  media,
}: {
  type: string;
  media: Music;
}) => {
  const { user } = useQueryData(["user"]);
  const { mutate } = useUserUpdate();
  const { setError } = useAuthContext();

  const handleAdd = () => {
    const closeBtn = document.getElementById("closeModal");
    if (type == "album") {
      const addAlbum = [...user.albums, media];
      const payload = {
        id: user.id,
        body: { albums: addAlbum },
      };
      try {
        mutate(payload);
        closeBtn?.click();
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
    } catch (error) {
      setError("Houve algum erro, tente novamente");
    }
  };

  return (
    <div>
      <h1 className="text-xl text-left text-gray-200">
        Adicionar {type == "music" ? "música" : "álbum"}
      </h1>
      <p className="text-sm text-gray-300 text-left mt-2 mb-6">
        Deseja adicionar {type == "music" ? "esta música" : "este álbum"} à sua
        biblioteca?
      </p>
      <div className="modal-action flex justify-between items-center">
        <label
          className="btn btn-sm btn-outline btn-error"
          htmlFor="general-modal"
          id="closeModal"
        >
          Cancelar
        </label>
        <button
          className="btn btn-sm btn-primary btn-outline"
          onClick={handleAdd}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};
