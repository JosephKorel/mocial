import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { HomePageProps, Post } from "../models/interfaces";
import ProtectedRoute from "../src/components/Protector";
import { usePosts, useQueryData, useUpdatePost } from "../utils/Hooks";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { updatePost } from "./api/query-tools";
import { useAuthContext } from "../src/context";

const Home: NextPage<HomePageProps> = () => {
  const router = useRouter();
  const { setError } = useAuthContext();
  const { data } = usePosts();
  const { user, profiles } = useQueryData(["user", "profiles"]);
  const { mutate } = useUpdatePost();
  useEffect(() => {
    if (!profiles) {
      router.push("/");
    }
  }, []);

  if (!profiles) {
    return <div></div>;
  }

  const posts = data as Post[];

  const handleLike = async (post: Post) => {
    const hasLiked = post.liked_by.includes(user.id);
    const removeLike = post.liked_by.filter((item) => item != user.id);
    const updatedLikes = hasLiked ? removeLike : [...post.liked_by, user.id];
    try {
      const body = { liked_by: updatedLikes };
      const payload = {
        id: post.id,
        body,
      };
      mutate(payload);
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      console.log(error);
    }
  };

  const Posts = ({ post }: { post: Post }) => {
    const author = post.profiles!;
    const subject = post.subject;
    const created_at = new Date(post.created_at!).toLocaleDateString("pt-BR");
    const hasLiked = post.liked_by.includes(user.id);
    return (
      <article className="text-center py-1 px-3 bg-dark rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-8 rounded-full border border-gray-100">
                <img
                  src={author.avatar_url}
                  alt={author.username}
                  referrerPolicy="no-referrer"
                ></img>
              </div>
            </div>
            <p className="text-sm italic underline text-gray-100">
              {author.username}
            </p>
          </div>
          <p className="font-light italic text-xs text-gray-400">
            {created_at}
          </p>
        </div>
        <div className="flex flex-col justify-center p-2 px-3 bg-dark shadow-md border border-secondary shadow-black rounded-md my-2 text-gray-100">
          <h1 className="text-xl italic">{post.title}</h1>
          <div className="p-[1px] mt-1 mb-4 w-11/12 mx-auto rounded-md bg-secondary"></div>
          <p className="text-sm font-thin text-justify py-2">{post.content}</p>
          <div className="flex items-center gap-1">
            {hasLiked ? (
              <BsHeartFill
                onClick={() => handleLike(post)}
                className="text-error"
              />
            ) : (
              <BsHeart onClick={() => handleLike(post)} />
            )}
            <span className="text-sm">{post.liked_by.length}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3">
          <p className="text-sm italic text-gray-100">{subject.name}</p>
          <img
            src={subject.cover.sm}
            alt={subject.name}
            className="rounded-full w-8"
          ></img>
        </div>
      </article>
    );
  };

  return (
    <ProtectedRoute>
      <div className="font-kanit pb-16">
        <header></header>
        <main className="mt-2">
          <section className="flex flex-col gap-10 p-2 py-3">
            {posts.map((post, index) => (
              <Posts post={post} key={index} />
            ))}
          </section>
          <input type="checkbox" id="my-modal" className="modal-toggle" />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
