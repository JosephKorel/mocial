import React, { useEffect, useState } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaCommentAlt } from "react-icons/fa";
import { GrSend } from "react-icons/gr";
import { RiSendPlaneFill } from "react-icons/ri";
import { Comment, Post } from "../../../../models/interfaces";
import { useQueryData, useUpdatePost } from "../../../../utils/Hooks";
import { getDate } from "../../../../utils/Tools";
import { useAuthContext } from "../../../context";
import { handleLike } from "./tools";

export const Posts = ({ post }: { post: Post }) => {
  const { user } = useQueryData(["user"]);
  const [content, setContent] = useState("");
  const { mutate } = useUpdatePost();
  const { setError } = useAuthContext();
  const author = post.profiles!;
  const subject = post.subject;
  const created_at = getDate(post.created_at!);
  const hasLiked = post.liked_by.includes(user.id);
  const postLikeParams = { post, user, mutate, setError };

  const handleComment = () => {
    if (!content) {
      return;
    }
    const comment: Comment = {
      author: user.id,
      content,
      created_at: new Date(),
      liked_by: [],
    };

    const body = { comments: [...post.comments, comment] };

    const payload = {
      id: post.id,
      body,
    };

    try {
      mutate(payload);
      setContent("");
    } catch (error) {
      setError("Houve algum erro, tente novamente");
      console.log(error);
    }
  };

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
        <p className="font-light italic text-xs text-gray-400">{created_at}</p>
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
          <div className="flex items-center justify-end gap-1">
            <FaCommentAlt className="text-gray-300" />
            <span className="text-sm">7</span>
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
      <div className="text-left shadow-md shadow-black rounded-md py-1 px-2">
        <p className="text-lg">Comentários</p>
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Escreva seu comentário"
            value={content}
            maxLength={165}
            onChange={(e) => setContent(e.currentTarget.value)}
            className="bg-inherit text-sm font-light relative block h-20 mt-4 rounded-md w-full p-3 border border-dark-200 placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
          />
          <button
            className="btn btn-xs btn-outline btn-primary self-end gap-1"
            onClick={handleComment}
          >
            Enviar <RiSendPlaneFill />
          </button>
        </div>

        <div className="rounded-md flex items-start gap-3 mt-4 p-2 border border-danube">
          <div className="avatar">
            <div className="w-12 rounded-full border border-gray-100">
              <img
                src={author.avatar_url}
                alt={author.username}
                referrerPolicy="no-referrer"
              ></img>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start text-sm">
              <p className="italic underline text-gray-100">
                {author.username}
              </p>
              <span>1d</span>
            </div>
            <p className="text-sm text-justify max-h-20 overflow-y-auto font-light">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <div className="flex items-center justify-end gap-1 mt-2">
              {hasLiked ? <BsHeartFill className="text-error" /> : <BsHeart />}
              <span className="text-sm">{post.liked_by.length}</span>
            </div>
          </div>
        </div>
        <div className="rounded-md flex items-start gap-3 mt-4 p-2 border border-gray-300">
          <div className="avatar">
            <div className="w-12 rounded-full border border-gray-100">
              <img
                src={author.avatar_url}
                alt={author.username}
                referrerPolicy="no-referrer"
              ></img>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start text-sm">
              <p className="italic underline text-gray-100">
                {author.username}
              </p>
              <span>1d</span>
            </div>
            <p className="text-sm text-justify max-h-20 overflow-y-auto font-light">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
