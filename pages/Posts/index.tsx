import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { Music } from "../../models/interfaces";
import { PostStep } from "../../src/components/Posts/Create";
import ProtectedRoute from "../../src/components/Protector";
import { useAlbums, useSongs, useToken } from "../../utils/Hooks";
import { formatAlbums, formatMusic } from "../../utils/Tools";

const NewPost: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [option, setOption] = useState(0);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Music[]>([]);
  const [selected, setSelected] = useState<Music | null>(null);
  const [step, setStep] = useState(1);
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

  const postProps = {
    title,
    content,
    setContent,
    setTitle,
    setStep,
    selected,
    option,
  };

  useEffect(() => {
    if (option == 1) {
      const showMusics = formatMusic(musics);
      setResults(showMusics);

      return;
    }

    const showAlbums = formatAlbums(albums);
    setResults(showAlbums);
  }, [musics, albums]);

  return (
    <div className="font-kanit py-2">
      <PostStep step={step} chooseProps={chooseProps} postProps={postProps} />
    </div>
  );
};

export default NewPost;
