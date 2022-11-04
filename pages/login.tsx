import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Alert } from "../src/components/Alert";
import { useAuthContext } from "../src/context";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { setError, setSuccess } = useAuthContext();

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSuccess("Você receberá um email com um link de acesso");
    } catch (error: any) {
      setError("Houve algum erro, tente novamente");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <div className="py-2 flex flex-col items-center justify-center h-screen font-kanit">
      <header className="w-full lg:w-2/3 m-auto absolute top-4">
        <h1 className="text-gray-100 font-semibold text-4xl text-center">
          <span className="font-kanit font-bold text-6xl text-secondary">
            M
          </span>
          ocial
        </h1>
      </header>
      <main className="w-11/12 lg:w-1/2 m-auto flex flex-col items-center gap-4 p-2 py-5 rounded-md bg-dark h-96">
        <div className="w-full text-center">
          <p className="text-gray-100 text-xl font-light">
            Entre usando seu email
          </p>
          <input
            className="bg-inherit w-11/12 mt-2 lg:w-2/3 text-primary rounded-md p-2 border border-primary active:ring-0 focus:ring-0 active:border-warning-focus outline-none"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(email);
            }}
            className="btn btn-secondary btn-outline text-white"
            disabled={loading}
          >
            <span>{loading ? "Aguarde" : "Me mande o link mágico!"}</span>
          </button>
        </div>
      </main>
      <Alert />
    </div>
  );
}
