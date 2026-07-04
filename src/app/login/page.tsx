"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Conta criada com sucesso! Verifique seu e-mail ou faça login.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg("Credenciais inválidas. Tente novamente.");
      } else {
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 font-[family-name:var(--font-geist-sans)] bg-[var(--astro-bg)] text-[var(--astro-text)]">
      
      {/* Brand Block (Menor que na landing) */}
      <div className="flex flex-col items-center gap-2 mb-10">
        <Link href="/">
          <div 
            className="w-24 h-24 relative bg-[var(--astro-primary)] transition-colors duration-300 hover:opacity-80 cursor-pointer"
            style={{
              WebkitMaskImage: "url('/brand/kalon-symbol-master.svg')",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
              maskImage: "url('/brand/kalon-symbol-master.svg')",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
        </Link>
        <span className="text-sm uppercase tracking-[0.25em] font-semibold text-[var(--astro-primary)]">
          Kalon Astro
        </span>
      </div>

      <main className="w-full max-w-sm">
        <div className="bg-[var(--astro-card)] p-8 rounded-2xl shadow-xl border border-white/5">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? "Criar Conta" : "Acessar Conta"}
          </h2>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className="text-sm text-[var(--astro-primary)] mt-1 font-medium text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg bg-[var(--astro-primary)] text-[var(--astro-bg)] hover:bg-[var(--astro-primary-dark)] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Aguarde..." : isSignUp ? "Cadastrar" : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm opacity-80">
            {isSignUp ? "Já possui conta? " : "Ainda não tem conta? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg("");
              }}
              className="font-semibold text-[var(--astro-primary)] hover:underline"
            >
              {isSignUp ? "Faça login" : "Criar conta"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
