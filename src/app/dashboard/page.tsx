"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Estrategia {
  id: string;
  nome: string;
  descricao: string;
  suite: string;
  modulo: string;
  versao: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [estrategias, setEstrategias] = useState<Estrategia[]>([]);
  const [loadingEstrategias, setLoadingEstrategias] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      } else {
        router.push("/login");
      }
      setLoadingUser(false);
    };
    
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchEstrategias = async () => {
      try {
        const response = await fetch("https://kalon-analyzer-production-69a7.up.railway.app/api/v1/estrategias");
        if (!response.ok) {
          throw new Error("Falha ao buscar estratégias.");
        }
        const data = await response.json();
        setEstrategias(data.estrategias || []);
      } catch (err: any) {
        setErrorMsg("Não foi possível carregar as estratégias. Tente novamente.");
      } finally {
        setLoadingEstrategias(false);
      }
    };

    fetchEstrategias();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--astro-bg)] text-[var(--astro-text)]">
        <p className="opacity-70">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-[family-name:var(--font-geist-sans)] bg-[var(--astro-bg)] text-[var(--astro-text)] flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 mb-16 pt-4">
        {/* Brand Block */}
        <Link href="/">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <div 
              className="w-32 h-32 relative bg-[var(--astro-primary)] transition-colors duration-300 group-hover:opacity-80"
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
            <span className="text-sm uppercase tracking-[0.25em] font-semibold text-[var(--astro-primary)]">
              Kalon Astro
            </span>
          </div>
        </Link>
        
        {/* User Info & Actions */}
        <div className="flex items-center gap-4 bg-[var(--astro-card)] px-5 py-3 rounded-full border border-white/5">
          <span className="text-sm opacity-80 hidden sm:inline-block">
            {userEmail}
          </span>
          <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
          <button
            onClick={handleSignOut}
            className="text-sm font-semibold transition-colors duration-300 text-[var(--astro-primary)] hover:text-[var(--astro-bg)] hover:bg-[var(--astro-primary)] px-3 py-1 rounded-full"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col">
        <h1 className="text-3xl font-bold mb-10 text-center md:text-left">
          Escolha uma estratégia
        </h1>

        {loadingEstrategias ? (
          <div className="text-center opacity-70 py-10">Carregando estratégias...</div>
        ) : errorMsg ? (
          <div className="text-center font-medium text-[var(--astro-primary)] py-10">
            {errorMsg}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {estrategias.map((estrategia) => (
              <Link key={estrategia.id} href={`/agenda?estrategia=${estrategia.id}`}>
                <div className="flex flex-col justify-between h-full p-6 rounded-2xl bg-[var(--astro-card)] border border-white/5 transition-all duration-300 hover:border-[var(--astro-primary)] hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg font-semibold text-[var(--astro-text)] leading-snug">
                        {estrategia.nome}
                      </h2>
                      {estrategia.status === "beta" && (
                        <span className="shrink-0 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--astro-primary)] border border-[var(--astro-primary)] rounded-full">
                          BETA
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-70 leading-relaxed">
                      {estrategia.descricao}
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <span className="text-xs opacity-40 uppercase tracking-widest font-mono">
                      v{estrategia.versao}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
