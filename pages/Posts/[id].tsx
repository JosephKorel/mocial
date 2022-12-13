import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaCommentAlt } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { RenderComment } from "../../src/components/Posts/Show";
import {
  handleComment,
  handleLike,
} from "../../src/components/Posts/Show/tools";
import { Modal } from "../../src/components/Profile/Modal";
import { useAuthContext } from "../../src/context";
import { useQueryData, useUpdatePost } from "../../utils/Hooks";
import { getDate } from "../../utils/Tools";

const Posts = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { posts, user } = useQueryData(["posts", "user"]);
  const post = posts?.filter((item) => item.id == Number(id))[0];
  const [content, setContent] = useState("");
  const [children, setChildren] = useState(<></>);
  const { mutate } = useUpdatePost();
  const { setError } = useAuthContext();
  if (!posts) return <div></div>;
  const author = post.profiles!;
  const subject = post.subject;
  const created_at = getDate(post.created_at!);
  const hasLiked = post.liked_by.includes(user.id);
  const comments = post.comments.sort((a, b) => b.created_at - a.created_at);
  const postLikeParams = { post, user, mutate, setError };
  const commentParams = { content, user, post, mutate, setError, setContent };

  const goToProfile = (id: string) => {
    if (id == user.id) {
      router.push("/profile");
      const closeBtn = document.getElementById("closeFriendModal");
      closeBtn?.click();
      return;
    }

    router.push({
      pathname: "/[seeUser]",
      query: { seeUser: id },
    });

    const closeBtn = document.getElementById("closeFriendModal");
    closeBtn?.click();
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
      <article className="text-center py-1 px-3 bg-dark rounded-md mt-4">
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
            <p
              className="text-sm italic underline text-gray-100"
              onClick={() => goToProfile(author.id)}
            >
              {author.username}
            </p>
          </div>
          <p className="font-light italic text-xs text-gray-400">
            {created_at}
          </p>
        </div>
        <div className="flex flex-col justify-center p-2 px-3 bg-dark shadow-md border border-danube shadow-black rounded-md my-2 text-gray-100">
          <div className="flex flex-col items-center justify-center">
            <img
              src={subject.cover.sm}
              alt={subject.name}
              className={`rounded-full w-14 border-2 border-danube`}
            ></img>

            <p className="text-xl font-extralight italic text-gray-100">
              {subject.name}
            </p>
          </div>
          <div className="p-[1px] mt-1 mb-4 w-11/12 mx-auto rounded-md bg-danube"></div>
          <h1 className="text-lg italic text-left">{post.title}</h1>
          <p className="text-sm font-thin text-justify py-2">{post.content}</p>
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-1">
              <FaCommentAlt className="text-gray-300" />
              <span className="text-sm">{post.comments.length}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              {hasLiked ? (
                <BsHeartFill
                  onClick={() => handleLike(postLikeParams)}
                  className="text-error"
                />
              ) : (
                <BsHeart onClick={() => handleLike(postLikeParams)} />
              )}
              <span className="text-sm">{post.liked_by.length}</span>
            </div>
          </div>
        </div>
        <div className="text-left rounded-md py-3">
          <p className="text-lg">Comentários</p>
          <div className="flex flex-col gap-2">
            <textarea
              placeholder={
                post.comments.length
                  ? "Escreva seu comentário"
                  : "Seja o primeiro a comentar"
              }
              value={content}
              maxLength={165}
              onChange={(e) => setContent(e.currentTarget.value)}
              className="bg-inherit text-sm font-light relative block h-20 mt-4 rounded-md w-full p-3 border border-dark-200 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
            />
            <button
              className="btn btn-xs btn-outline self-end gap-1 btn-primary"
              onClick={() => handleComment(commentParams)}
              disabled={content.length < 3}
            >
              Enviar <RiSendPlaneFill />
            </button>
          </div>
          <div className="w-full p-[1px] bg-gray-300 rounded-md mt-4 mb-2"></div>
          <div className="flex flex-col gap-2">
            {comments.map((comment, index) => (
              <RenderComment
                key={index}
                comment={comment}
                post={post}
                setChildren={setChildren}
              />
            ))}
          </div>
        </div>
      </article>
      <Modal>{children}</Modal>
    </div>
  );
};

export default Posts;
