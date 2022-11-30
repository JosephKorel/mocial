import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import { useAuthContext } from "../../context";
import {
  ChooseProps,
  CreateProps,
  PostProps,
  ResultProps,
  StepProps,
} from "./models";

export const PostStep = ({ step, chooseProps, postProps }: StepProps) => {
  if (step == 1) {
    return <ChooseSubject props={chooseProps} />;
  }

  return <CreatePost props={postProps} />;
};

export const PostHeader = () => {
  return <div></div>;
};

export const ResultList = ({ props }: ResultProps) => {
  const { result, selected, setSelected } = props;
  const isSelected = selected?.id == result.id;
  return (
    <li
      className={`w-full m-auto relative z-10 border bg-dark-600 cursor-pointer flex justify-between items-center ${
        isSelected ? "border-danube" : "border-transparent"
      } duration-200 lg:hover:bg-base-300 p-1 px-2 rounded-lg`}
      onClick={() => setSelected(result)}
    >
      <div className="flex items-center gap-4">
        <img
          src={result.cover.sm}
          className="rounded-full w-12 lg:w-auto"
        ></img>
        <div className="flex flex-col self-start">
          <p
            className={`lg:text-lg ${
              result.name.length > 25 ? "text-sm" : "text-base"
            } ${isSelected ? "text-danube font-medium" : "text-gray-200"}`}
          >
            {result.name}
          </p>
          <p className="font-thin text-gray-400 text-sm">
            {result.artist.map((obj, i, arr) => {
              return i == arr.length - 1 ? obj : obj + ", ";
            })}
          </p>
        </div>
      </div>
    </li>
  );
};

export const ChooseSubject = ({ props }: ChooseProps) => {
  const {
    option,
    setOption,
    results,
    setResults,
    selected,
    setSelected,
    search,
    setSearch,
    setStep,
  } = props;
  const resultProps = { selected, setSelected };
  const { setError } = useAuthContext();

  const handleClear = () => {
    setSearch("");
    setResults([]);
    setSelected(null);
  };

  const handleNextStep = () => {
    if (!selected) {
      setError(
        `Você deve selecionar ${option == 1 ? "uma música" : "um álbum"}`
      );

      return;
    }

    setStep(2);
  };
  return (
    <div>
      <header className="text-center">
        <h1 className="text-2xl font-semibold">Nova publicação</h1>
        <h2 className="mt-2">Sobre o que você quer falar?</h2>
        <div className="flex justify-center gap-4 mt-1">
          <div
            className={`badge badge-warning ${option != 1 && "badge-outline"}`}
            onClick={() => setOption(1)}
          >
            Música
          </div>
          <div
            className={`badge badge-warning ${option != 2 && "badge-outline"}`}
            onClick={() => setOption(2)}
          >
            Álbum
          </div>
        </div>
      </header>
      <main className="py-2 px-4 mt-4">
        {option != 0 && (
          <section>
            <div className="bg-dark rounded-lg flex justify-between items-center relative">
              <input
                placeholder={`Procurar ${option == 1 ? "música" : "álbum"}`}
                className="bg-inherit relative block rounded-md w-full px-3 pl-8 py-2 border border-danube placeholder-gray-400 text-gray-100 focus:outline-none focus:ring-danube focus:border-danube"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <AiOutlineSearch className="absolute left-2 text-lg text-danube" />
              {search.length > 0 && (
                <MdClear
                  className="absolute right-2 text-lg text-gray-400"
                  onClick={handleClear}
                />
              )}
            </div>
            <div>
              <ul className="h-[22rem] bg-dark rounded-md mt-4 p-2 overflow-y-auto flex flex-col gap-2">
                {results.map((item, index) => (
                  <ResultList
                    props={{ ...resultProps, result: item }}
                    key={index}
                  />
                ))}
              </ul>
            </div>
            <div className="text-right mt-4">
              <button
                className={`btn btn-sm btn-primary ${
                  !selected && "btn-outline"
                }`}
                onClick={handleNextStep}
              >
                Avançar
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export const CreatePost = ({ props }: CreateProps) => {
  const { title, content, setContent, setTitle, setStep, selected } = props;
  return (
    <div>
      <header>
        <div className="flex justify-center items-center">
          <img
            src={selected?.cover.sm}
            alt={selected?.name}
            className="rounded-full"
          ></img>
          <h1>{selected?.name}</h1>
        </div>
      </header>
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
        <div className="flex justify-between">
          <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>
            Voltar
          </button>
          <button
            className="btn btn-primary btn-outline btn-sm"
            /* onClick={handleCreate} */
          >
            Publicar
          </button>
        </div>
      </section>
    </div>
  );
};
