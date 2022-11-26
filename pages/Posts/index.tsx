import { NextPage } from "next";
import React, { useState } from "react";
import { Post } from "../../models/interfaces";
import { useQueryData } from "../../utils/Hooks";
import { createPost } from "../api/query-tools";

const NewPost: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useQueryData(["user", "profiles", "post"]);

  const handleCreate = async () => {
    const payload: Post = {
      title,
      content,
      created_at: new Date(),
      author: user.id,
    };

    try {
      await createPost(payload);
      console.log("success");
    } catch (error) {
      console.log(error);
    }
    return;
  };

  return (
    <div>
      <header>
        <h1>Nova publicação</h1>
      </header>
      <main>
        <section>
          <div className="flex flex-col">
            <label>Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              className="bg-inherit relative block rounded-md w-full px-3 pl-8 py-2 border border-danube placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            className="bg-inherit relative block rounded-md w-full px-3 pl-8 py-2 border border-danube placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          />
        </section>
        <div>
          <button
            className="btn btn-primary btn-outline btn-sm"
            onClick={handleCreate}
          >
            Publicar
          </button>
        </div>
      </main>
    </div>
  );
};

export default NewPost;
