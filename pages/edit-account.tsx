import React, { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { MdArrowBackIos } from "react-icons/md";
import { Profile } from "../models/interfaces";
import {
  Description,
  EditAccountHeader,
  SeeAlbums,
  SeeMusics,
} from "../src/components/EditAccount";
import { useUser } from "../utils/Hooks";

const EditAccount = () => {
  const { data } = useUser();
  const [page, setPage] = useState<JSX.Element | null>(null);
  if (!data) {
    return <div></div>;
  }

  const user = data as Profile;

  const showPage = (option: number) => {
    switch (option) {
      case 1:
        setPage(<SeeAlbums />);
        break;

      case 2:
        setPage(<SeeMusics />);
        break;
      default:
        break;
    }
  };

  return (
    <div className="font-kanit">
      {!page ? (
        <>
          <EditAccountHeader />
          <main className="px-4">
            <h1 className="text-lg">Descrição</h1>
            <Description user={user} />
            <ul className="flex flex-col gap-3 mt-4">
              <li
                className="flex justify-between items-center pl-2 p-1 rounded-md bg-dark"
                onClick={() => showPage(1)}
              >
                <span>Ver àlbuns</span>
                <AiOutlineRight className="text-danube" />
              </li>
              <li
                className="flex justify-between items-center pl-2 p-1 rounded-md bg-dark"
                onClick={() => showPage(2)}
              >
                <span>Ver músicas</span>
                <AiOutlineRight className="text-danube" />
              </li>
            </ul>
          </main>
        </>
      ) : (
        <>
          <header className="py-4 px-4">
            <button
              onClick={() => setPage(null)}
              className="text-gray-100 px-3 py-1 rounded-md bg-dark duration-200 lg:hover:text-warning flex items-center justify-center"
            >
              <MdArrowBackIos className="lg:text-xl" />
              <span className="text-sm font-thin">VOLTAR</span>
            </button>
          </header>
          <main className="px-4 pb-16">{page}</main>
        </>
      )}
    </div>
  );
};

export default EditAccount;
