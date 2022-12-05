import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { HomePageProps, Post } from "../models/interfaces";
import ProtectedRoute from "../src/components/Protector";
import { usePosts, useQueryData } from "../utils/Hooks";
import { Posts } from "../src/components/Posts/Show";

const Home: NextPage<HomePageProps> = () => {
  const router = useRouter();
  const { data } = usePosts();
  const { profiles } = useQueryData(["user", "profiles"]);

  useEffect(() => {
    if (!profiles) {
      router.push("/");
    }
  }, []);

  if (!profiles || !data) {
    return <div></div>;
  }

  const posts = data as Post[];

  return (
    <ProtectedRoute>
      <div className="font-kanit pb-16">
        <main className="mt-2">
          <section className="flex flex-col gap-10 p-2 py-3">
            {posts.map((post, index) => (
              <Posts post={post} key={index} />
            ))}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
