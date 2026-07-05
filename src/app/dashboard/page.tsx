"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import FormularioKalon, { FormDados } from "@/components/FormularioKalon";
import GridEstrategias, { Estrategia } from "@/components/GridEstrategias";
import KalonIdentity from "@/components/KalonIdentity";
import KalonLegenda from "@/components/KalonLegenda";
import KalonObservacoes from "@/components/KalonObservacoes";
import AgendaKalon from "@/components/AgendaKalon";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramEstrategia = searchParams.get("estrategia");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // App State
  const [estrategias, setEstrategias] = useState<Estrategia[]>([]);
  const [loadingEstrategias, setLoadingEstrategias] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form State
  const [dadosFormulario, setDadosFormulario] = useState<FormDados>({
    nome: "",
    dataNascimento: "",
    horaNascimento: "",
    cidadeSelecionada: null,
    dataInicio: ""
  });
  const [cidadeBusca, setCidadeBusca] = useState("");

  // Result State
  const [resultadoAgenda, setResultadoAgenda] = useState<any | null>(null);
  const [loadingAgenda, setLoadingAgenda] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

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

  const handleDadosChange = (novosDados: Partial<FormDados>) => {
    setDadosFormulario(prev => ({ ...prev, ...novosDados }));
  };

  const handleGerarCalendario = async (estrategia_id: string) => {
    if (!dadosFormulario.nome || !dadosFormulario.dataNascimento || !dadosFormulario.cidadeSelecionada || !dadosFormulario.dataInicio) {
      setErrorMsg("Preencha todos os campos do formulário (Nome, Data, Cidade e Data Início) antes de gerar a agenda.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoadingAgenda(true);
    setErrorMsg("");

    try {
      const payload = {
        estrategia_id: estrategia_id,
        nome: dadosFormulario.nome,
        data_nascimento: dadosFormulario.dataNascimento,
        hora_nascimento: dadosFormulario.horaNascimento || "00:00",
        cidade: dadosFormulario.cidadeSelecionada,
        data_inicio: dadosFormulario.dataInicio
      };

      const res = await fetch("https://kalon-analyzer-production-69a7.up.railway.app/api/v1/agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Falha ao gerar agenda. Verifique os dados e tente novamente.");
      }

      const data = await res.json();
      setResultadoAgenda(data);
      
      // Rolar suavemente para o resultado
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Erro desconhecido ao comunicar com o servidor.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoadingAgenda(false);
    }
  };

  const handleNovaAgenda = () => {
    setResultadoAgenda(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pt-4 print:hidden">
        {/* Brand Block */}
        <Link href="/">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <div 
              className="w-24 h-24 relative bg-[var(--astro-primary)] transition-colors duration-300 group-hover:opacity-80"
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
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--astro-primary)]">
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
      <main className="w-full max-w-5xl flex flex-col items-center gap-12">
        
        {/* Formulário Fixo no Topo */}
        <div className="w-full max-w-2xl print:hidden">
          <FormularioKalon 
            dados={dadosFormulario}
            onDadosChange={handleDadosChange}
            cidadeBusca={cidadeBusca}
            onCidadeBuscaChange={setCidadeBusca}
            disabled={loadingAgenda}
          />
        </div>

        {/* Área Dinâmica: Grid -> Loading -> Resultado */}
        <div className="w-full flex flex-col items-center min-h-[400px]">
          {loadingAgenda ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-12 animate-in fade-in duration-300">
              <svg className="animate-spin h-10 w-10 text-[var(--astro-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm opacity-70">Calculando trânsitos astrológicos precisos...</p>
            </div>
          ) : resultadoAgenda ? (
            <div ref={resultsRef} className="w-full max-w-4xl animate-in slide-in-from-bottom-8 fade-in duration-500 mt-4">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-[var(--astro-primary)]">
                  {resultadoAgenda.estrategia_nome || "Sua Agenda Astrológica"}
                </h2>
                <button 
                  onClick={handleNovaAgenda}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold transition-colors print:hidden"
                >
                  ← Voltar às Estratégias
                </button>
              </div>

              <div className="mb-12">
                {resultadoAgenda.identity && (
                  <KalonIdentity identity={resultadoAgenda.identity} />
                )}
                
                {resultadoAgenda.legenda && (
                  <KalonLegenda legenda={resultadoAgenda.legenda} />
                )}
                
                <KalonObservacoes 
                  o_que_e={resultadoAgenda.o_que_e} 
                  como_usar={resultadoAgenda.como_usar} 
                  observacoes={resultadoAgenda.observacoes} 
                />
              </div>

              <AgendaKalon janelas={resultadoAgenda.janelas} nome={resultadoAgenda.nome} />
              
              <div className="mt-12 text-center pb-12 print:hidden">
                <button 
                  onClick={handleNovaAgenda}
                  className="inline-block py-3 px-8 rounded-full font-semibold transition-all duration-300 border border-[var(--astro-primary)] text-[var(--astro-primary)] hover:bg-[var(--astro-primary)] hover:text-[var(--astro-bg)]"
                >
                  Fazer Nova Agenda
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold mb-8 text-center self-start md:self-auto w-full max-w-5xl">
                {paramEstrategia ? "Estratégia Selecionada" : "Escolha uma estratégia"}
              </h2>
              <GridEstrategias 
                estrategias={paramEstrategia ? estrategias.filter(e => e.id === paramEstrategia) : estrategias}
                loadingEstrategias={loadingEstrategias}
                errorMsg={errorMsg}
                onSelect={handleGerarCalendario}
              />
              {paramEstrategia && (
                <div className="mt-8">
                  <Link href="/dashboard" className="text-sm font-semibold opacity-70 hover:opacity-100 hover:text-[var(--astro-primary)] transition-all">
                    Ver todas as estratégias
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--astro-bg)] text-[var(--astro-text)]">
        <p className="opacity-70">Carregando...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

