import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Music, Post } from "../../models/interfaces";
import {
  ChooseSubject,
  PostStep,
  ResultList,
} from "../../src/components/Posts";
import ProtectedRoute from "../../src/components/Protector";
import { useAlbums, useQueryData, useSongs, useToken } from "../../utils/Hooks";
import { formatAlbums, formatMusic } from "../../utils/Tools";
import { createPost } from "../api/query-tools";

const NewPost: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [option, setOption] = useState(0);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Music[]>([]);
  const [selected, setSelected] = useState<Music | null>(null);
  const [step, setStep] = useState(1);
  const { user } = useQueryData(["user"]);
  const token = useToken();
  const { data: albums } = useAlbums(search, token);
  const { data: musics } = useSongs(search, token);

  const chooseProps = {
    option,
    setOption,
    results,
    selected,
    setSelected,
    search,
    setSearch,
    setResults,
    setStep,
  };

  const postProps = { title, content, setContent, setTitle, setStep, selected };

  useEffect(() => {
    if (option == 1) {
      const showMusics = formatMusic(musics);
      setResults(showMusics);

      return;
    }

    const showAlbums = formatAlbums(albums);
    setResults(showAlbums);
  }, [musics, albums]);

  const handleCreate = async () => {
    const payload: Post = {
      title,
      content,
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
    <ProtectedRoute>
      <div className="font-kanit py-2">
        <PostStep step={step} chooseProps={chooseProps} postProps={postProps} />
      </div>
    </ProtectedRoute>
  );
};

export default NewPost;
