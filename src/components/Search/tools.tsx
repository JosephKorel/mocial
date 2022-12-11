import { Post, Profile } from "../../../models/interfaces";
import { getSimilarity } from "../../../utils/Tools";

export const handleSearch = (
  users: Profile[],
  posts: Post[],
  search: string
) => {
  const reference = (item: Post | Profile) => {
    /* eslint-disable no-eval */

    return typeof item.id == "number"
      ? //@ts-ignore
        (item.title as keyof Post)
      : //@ts-ignore
        (item.username as keyof Profile);
  };

  let results: (Post | Profile)[] = [];
  const profileFilter = users.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );
  const postFilter = posts.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  results = profileFilter.slice();
  results = results.concat(postFilter);

  results.sort(
    (a, b) =>
      getSimilarity(reference(b), search.toLowerCase()) -
      getSimilarity(reference(a), search.toLowerCase())
  );

  return results;
};
