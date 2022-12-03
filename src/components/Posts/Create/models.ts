import { Music } from "../../../../models/interfaces";

export interface ParentProps {
  option: number;
  setOption: (data: number) => void;
  results: Music[];
  setResults: (data: Music[]) => void;
  selected: Music | null;
  setSelected: (data: Music | null) => void;
  search: string;
  setSearch: (data: string) => void;
  setStep: (data: number) => void;
}

export interface ResultProps {
  props: {
    result: Music;
    selected: Music | null;
    setSelected: (data: Music) => void;
  };
}

export interface ChooseProps {
  props: ParentProps;
}

export interface StepProps {
  step: number;
  chooseProps: ParentProps;
  postProps: PostProps;
}

export interface PostProps {
  title: string;
  setTitle: (data: string) => void;
  content: string;
  setContent: (data: string) => void;
  setStep: (data: number) => void;
  selected: Music | null;
  option: number;
}

export interface CreateProps {
  props: PostProps;
}
