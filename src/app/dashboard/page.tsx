"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    
    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--astro-bg)] text-[var(--astro-text)]">
        <p className="opacity-70">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 font-[family-name:var(--font-geist-sans)] bg-[var(--astro-bg)] text-[var(--astro-text)]">
      <main className="w-full max-w-2xl text-center flex flex-col items-center gap-8">
        
        <div className="bg-[var(--astro-card)] p-10 rounded-2xl shadow-xl border border-white/5 w-full">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg opacity-80 mb-8">
            Bem-vindo(a), <span className="font-semibold text-[var(--astro-primary)]">{userEmail}</span>!
          </p>
          
          <button
            onClick={handleSignOut}
            className="px-8 py-3 rounded-full font-semibold transition-all duration-300 border border-[var(--astro-primary)] text-[var(--astro-primary)] hover:bg-[var(--astro-primary)] hover:text-[var(--astro-bg)]"
          >
            Sair
          </button>
        </div>

      </main>
    </div>
  );
}
