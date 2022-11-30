import { Profile } from "../../../../models/interfaces";

export const getFollowers = (
  target: Profile,
  profiles: Profile[]
): Profile[] => {
  if (!target) return [];

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
  if (!target) return [];

  const getProfiles = target.following.reduce((acc, curr) => {
    const filter = profiles.filter((item) => item.id == curr);
    acc.push(filter[0]);
    return acc;
  }, [] as Profile[]);

  return getProfiles;
};
