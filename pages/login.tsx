import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Alert } from "../src/components/Alert";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSuccess("Você receberá um email com um link de acesso");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <main className="py-2">
      <header className="w-2/3 m-auto">
        <h1 className="text-warning font-extrabold text-6xl">Mocial</h1>
      </header>
      <section className="w-1/2 m-auto flex flex-col items-center p-2 rounded-md">
        <p className="">Digite seu email</p>
        <div className="w-full text-center">
          <input
            className="bg-inherit w-2/3 text-warning rounded-md p-2 border border-warning active:ring-0 focus:ring-0 active:border-warning-focus outline-none"
            type="email"
            placeholder="Your email"
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
            className="btn btn-accent text-white"
            disabled={loading}
          >
            <span>{loading ? "Aguarde" : "Me mande o link mágico!"}</span>
          </button>
        </div>
      </section>
      <Alert success={success} error={error} />
    </main>
  );
}
