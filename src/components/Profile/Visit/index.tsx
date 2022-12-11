import { Profile } from "../../../../models/interfaces";

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
