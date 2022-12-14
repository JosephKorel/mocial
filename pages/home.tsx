import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { HomePageProps, Post } from "../models/interfaces";
import ProtectedRoute from "../src/components/Protector";
import { usePosts, useQueryData } from "../utils/Hooks";
import { Posts } from "../src/components/Posts/Show";
import { Modal } from "../src/components/Profile/Modal";
import { useAuthContext } from "../src/context";

const Home: NextPage<HomePageProps> = () => {
  const router = useRouter();
  const { data } = usePosts();
  const { profiles } = useQueryData(["user", "profiles"]);
  const { element } = useAuthContext();

  useEffect(() => {
    if (!profiles) {
      router.push("/");
    }
  }, []);

  if (!profiles || !data) {
    return (
      <div className="h-[28rem] flex flex-col items-center justify-center">
        <h1 className="text-xl">Carregando</h1>
        <div className="p-3 border border-danube animate-spin"></div>
      </div>
    );
  }
  const allPosts = data as Post[];
  const posts = allPosts.sort((a, b) => b.created_at - a.created_at);

  return (
    <ProtectedRoute>
      <>
        <div className="font-kanit pb-16">
          <main className="mt-2">
            <section className="flex flex-col gap-10 p-2 py-3">
              {posts.map((post, index) => (
                <Posts post={post} key={index} />
              ))}
            </section>
          </main>
        </div>
        <Modal className="py-4 px-2">{element}</Modal>
      </>
    </ProtectedRoute>
  );
};

export default Home;
