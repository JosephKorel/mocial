import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useAuthContext } from "../../../src/context";
import { useMutatePost, useQueryData } from "../../../utils/Hooks";

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { posts } = useQueryData(["posts"]);
  const post = posts.filter((item) => item.id == Number(id))[0];
  const [content, setContent] = useState(post.content);
  const [title, setTitle] = useState(post.title);
  const { mutate } = useMutatePost("update");
  const { setError } = useAuthContext();
  const subject = post.subject;

  const handleEdit = () => {
    if (title.length < 8) {
      setError("O título deve ter no mínimo 8 caracteres");
      return;
    }

    if (content.length < 16) {
      setError("Sua publicação deve ter no mínimo 16 caracteres");
      return;
    }

    const body = {
      title,
      content,
      updated_at: new Date().getTime(),
    };

    const payload = {
      id: Number(id),
      body,
      option: "update",
    };

    try {
      mutate(payload);

      router.push("/");
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      console.log(error);
    }
  };

  return (
    <div className="p-2 pb-16 font-kanit">
      <header>
        <button
          onClick={() => router.back()}
          className="btn btn-sm btn-outline"
        >
          <MdArrowBackIos className="lg:text-xl" />
          <span className="text-sm font-thin">VOLTAR</span>
        </button>
      </header>
      <article className="text-center p-3 bg-dark rounded-md mt-4">
        <div className="flex flex-col items-center justify-center">
          <img
            src={subject.cover.sm}
            alt={subject.name}
            className={`rounded-full w-14 border-2 border-gray-200`}
          ></img>

          <p className="text-xl font-extralight italic text-gray-100">
            {subject.name}
          </p>
        </div>
        <div className="p-[1px] mt-1 mb-4 w-11/12 mx-auto rounded-md bg-gray-200"></div>
        <div className="flex flex-col justify-center py-4 px-3 bg-dark shadow-md shadow-black rounded-md my-2 text-gray-100">
          <input
            className="bg-inherit relative block rounded-md w-full px-3 py-2 border border-dark-200 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <textarea
            className="bg-inherit font-light relative block h-[22rem] mt-4 rounded-md w-full p-3 border border-dark-200 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
        </div>
        <div className="text-right mt-4">
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={handleEdit}
          >
            Confirmar
          </button>
        </div>
      </article>
    </div>
  );
};

export default EditPost;
