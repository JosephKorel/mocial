import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsHeart, BsHeartFill, BsThreeDots } from "react-icons/bs";
import { FaCommentAlt } from "react-icons/fa";
import { RiDeleteBackLine, RiEdit2Line, RiSendPlaneFill } from "react-icons/ri";
import { Comment, Post } from "../../../../models/interfaces";
import {
  useMutatePost,
  useQueryData,
  useUpdatePost,
} from "../../../../utils/Hooks";
import {
  getDate,
  getDateDifference,
  getProfile,
} from "../../../../utils/Tools";
import { useAuthContext } from "../../../context";
import { Modal } from "../../Profile/Modal";
import { handleComment, handleCommentLike, handleLike } from "./tools";

export const Posts = ({ post }: { post: Post }) => {
  const router = useRouter();
  const { user } = useQueryData(["user"]);
  const [content, setContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { mutate } = useUpdatePost();
  const { setError } = useAuthContext();
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
          <p
            className="text-sm italic underline text-gray-100"
            onClick={() => goToProfile(author.id)}
          >
            {author.username}
          </p>
        </div>
        <p className="font-light italic text-xs text-gray-400">{created_at}</p>
      </div>
      <div className="flex flex-col justify-center p-2 px-3 bg-dark shadow-md border border-danube shadow-black rounded-md my-2 text-gray-100 relative">
        {author.id == user.id ? <PostOptions id={post.id} /> : <></>}
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
          <div
            className="flex items-center gap-1"
            onClick={() => setShowComments(!showComments)}
          >
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
      {showComments ? (
        <div className="text-left rounded-md py-1">
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
              className="btn btn-xs btn-outline btn-primary self-end gap-1"
              onClick={() => handleComment(commentParams)}
            >
              Enviar <RiSendPlaneFill />
            </button>
          </div>
          <div className="w-full p-[1px] bg-gray-300 rounded-md mt-4 mb-2"></div>
          <div className="flex flex-col gap-2 py-2 pb-4">
            {comments.map((comment, index) => (
              <RenderComment key={index} comment={comment} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <Modal>
        <ConfirmDelete id={post.id} />
      </Modal>
    </article>
  );
};

export const RenderComment = ({
  comment,
  post,
}: {
  comment: Comment;
  post: Post;
}) => {
  const router = useRouter();
  const { profiles, user } = useQueryData(["profiles", "user"]);
  const { mutate } = useUpdatePost();
  const { setError } = useAuthContext();
  const author = getProfile(profiles, comment.author);
  const hasLiked = comment.liked_by.includes(user.id);
  const timestamp = getDateDifference(comment.created_at);
  const handleLikeParams = { post, comment, mutate, setError, user, hasLiked };

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
    <article className="rounded-md flex items-start gap-3 mt-4 p-2 shadow-md shadow-black">
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
          <p
            className="italic underline text-gray-100"
            onClick={() => goToProfile(author.id)}
          >
            {author.username}
          </p>
          <span className="text-gray-400">{timestamp}</span>
        </div>
        <p className="text-sm text-justify max-h-20 overflow-y-auto font-light">
          {comment.content}
        </p>
        <div className="flex items-center justify-end gap-1 mt-2">
          {hasLiked ? (
            <BsHeartFill
              className="text-error"
              onClick={() => handleCommentLike(handleLikeParams)}
            />
          ) : (
            <BsHeart onClick={() => handleCommentLike(handleLikeParams)} />
          )}
          <span className="text-sm">{comment.liked_by.length}</span>
        </div>
      </div>
    </article>
  );
};

export const PostOptions = ({ id }: { id: number }) => {
  const router = useRouter();
  const editPost = (id: number) => {
    router.push({ pathname: "/Posts/Edit/[id]", query: { id } });
  };
  return (
    <div className="dropdown dropdown-end absolute top-2 right-2">
      <button tabIndex={0} className="p-1 px-2 rounded-md">
        <BsThreeDots />
      </button>
      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content text-gray-300 shadow bg-base-200 rounded-md w-44"
      >
        <li>
          <label onClick={() => editPost(id)}>
            <RiEdit2Line />
            Editar
          </label>
        </li>
        <li>
          <label htmlFor="general-modal">
            <RiDeleteBackLine /> Excluir
          </label>
        </li>
      </ul>
    </div>
  );
};

export const ConfirmDelete = ({ id }: { id: number }) => {
  const { mutate } = useMutatePost("delete");
  const handleDelete = () => {
    let payload = { id, body: {}, option: "delete" };
    const closeBtn = document.getElementById("closeModal");
    try {
      mutate(payload);
      closeBtn?.click();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="text-xl text-left text-gray-200">Excluir publicação</h1>
      <p className="text-sm text-gray-300 text-left mt-2 mb-6">
        Deseja mesmo excluir esta publicação? De id {id}
      </p>
      <div className="modal-action flex justify-between items-center">
        <label
          className="btn btn-sm btn-outline"
          htmlFor="general-modal"
          id="closeModal"
        >
          Cancelar
        </label>
        <button
          className="btn btn-sm btn-error btn-outline"
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};
