import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-2">
      <header className="w-2/3 m-auto">
        <h1 className="text-warning font-extrabold text-6xl">Mocial</h1>
      </header>
      <section className="w-1/2 m-auto flex flex-col items-center p-2 border border-warning rounded-md bg-base-300">
        <h1 className="">Supabase + Next.js</h1>
        <p className="">Sign in via magic link with your email below</p>
        <div>
          <input
            className="bg-gray-100 rounded-md p-2 border border-accent active:ring-0 focus:ring-0 active:border-accent-focus outline-none"
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
            <span>{loading ? "Loading" : "Send magic link"}</span>
          </button>
        </div>
      </section>
    </main>
  );
}
