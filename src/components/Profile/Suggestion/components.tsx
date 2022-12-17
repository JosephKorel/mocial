import { TiThumbsOk, TiThumbsUp, TiThumbsDown } from "react-icons/ti";
import { Suggestion } from "../../../../models/interfaces";
import {
  useNotificationMutation,
  useQueryData,
  useUserUpdate,
} from "../../../../utils/Hooks";
import { useState } from "react";
import { useAuthContext } from "../../../context";
import { rateSuggestion } from "./tools";

export const RateBadge = ({ rate }: { rate: number }) => {
  switch (rate) {
    case 1:
      return (
        <div className="badge badge-warning gap-1 badge-sm">
          <TiThumbsDown /> Ruim
        </div>
      );

    case 2:
      return (
        <div className="badge badge-warning gap-1 badge-sm">
          <TiThumbsUp /> Boa
        </div>
      );

    case 3:
      return (
        <div className="badge badge-warning gap-1 badge-sm">
          <TiThumbsOk /> Ótima
        </div>
      );

    default:
      return <div className="px-1"></div>;
  }
};

export const RateStep = ({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (data: number) => void;
}) => {
  return (
    <div className="flex justify-around mt-4">
      <div
        className={`badge badge-warning gap-1 ${
          selected != 1 && "badge-outline"
        }`}
        onClick={() => setSelected(1)}
      >
        <TiThumbsDown /> Ruim
      </div>
      <div
        className={`badge badge-warning gap-1 ${
          selected != 2 && "badge-outline"
        }`}
        onClick={() => setSelected(2)}
      >
        <TiThumbsUp /> Boa
      </div>
      <div
        className={`badge badge-warning gap-1 ${
          selected != 3 && "badge-outline"
        }`}
        onClick={() => setSelected(3)}
      >
        <TiThumbsOk /> Ótima
      </div>
    </div>
  );
};

export const RateSuggestion = ({ result }: { result: Suggestion }) => {
  const { setError, setSuccess } = useAuthContext();
  const { user } = useQueryData(["user"]);
  const { mutate } = useUserUpdate();
  const sendNotification = useNotificationMutation();
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(1);

  const rateParams = {
    selected,
    setError,
    step,
    result,
    mutate,
    user,
    setStep,
    setSuccess,
    sendNotification,
  };

  return (
    <div>
      <h1 className="text-xl">Avaliar sugestão</h1>
      {step == 1 ? (
        <RateStep selected={selected} setSelected={setSelected} />
      ) : (
        <div>
          <h2>
            Deseja adicionar{" "}
            {result.type == "track"
              ? "esta música às suas músicas"
              : "este álbum aos seus álbums"}
            ?
          </h2>
        </div>
      )}
      <div className="modal-action flex justify-between font-kanit">
        <label
          htmlFor="general-modal"
          className="btn btn-sm btn-outline btn-error"
          id="closeModal"
        >
          {step == 1 ? "Fechar" : "Não"}
        </label>
        <button
          className="btn btn-sm btn-primary btn-outline"
          onClick={() => rateSuggestion({ rate: rateParams })}
        >
          {step == 1 ? "Confirmar" : "Sim"}
        </button>
      </div>
    </div>
  );
};
