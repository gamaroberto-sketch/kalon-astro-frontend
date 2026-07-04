"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Cidade {
  id: string;
  nome: string;
  estado: string;
  display: string;
}

interface AgendaResult {
  // Define basics for now
  nome: string;
  janelas: any[];
  identity?: any;
  [key: string]: any;
}

function AgendaFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL params
  const estrategiaId = searchParams.get("estrategia");

  // Form State
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [horaNascimento, setHoraNascimento] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string | null>(null);

  // Autocomplete State
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadesFiltradas, setCidadesFiltradas] = useState<Cidade[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // App State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultado, setResultado] = useState<AgendaResult | null>(null);

  // Carregar Cidades ao montar
  useEffect(() => {
    async function fetchCidades() {
      try {
        const res = await fetch("https://kalon-analyzer-production-69a7.up.railway.app/api/v1/cidades");
        if (res.ok) {
          const data = await res.json();
          setCidades(data.cidades || []);
        }
      } catch (err) {
        console.error("Erro ao buscar cidades:", err);
      }
    }
    fetchCidades();
  }, []);

  // Filtrar cidades conforme o usuário digita
  useEffect(() => {
    if (cidadeBusca.trim() === "") {
      setCidadesFiltradas([]);
      return;
    }
    // Ignorar filtro se a busca bater com a cidade selecionada (evita reabrir menu)
    if (cidadeSelecionada && cidadeBusca === cidadeSelecionada) {
      setCidadesFiltradas([]);
      return;
    }
    const termo = cidadeBusca.toLowerCase();
    const filtradas = cidades.filter(c => 
      c.display.toLowerCase().includes(termo)
    ).slice(0, 10); // Limitar a 10 resultados para performance visual
    
    setCidadesFiltradas(filtradas);
  }, [cidadeBusca, cidades, cidadeSelecionada]);

  // Click outside para fechar o autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelecionarCidade = (cidadeDisplay: string) => {
    setCidadeSelecionada(cidadeDisplay);
    setCidadeBusca(cidadeDisplay);
    setIsAutocompleteOpen(false);
  };

  const handleCidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCidadeBusca(e.target.value);
    setCidadeSelecionada(null); // Invalida a seleção se o usuário voltar a digitar
    setIsAutocompleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estrategiaId) {
      setErrorMsg("Estratégia não identificada. Volte ao Dashboard e tente novamente.");
      return;
    }
    if (!cidadeSelecionada) {
      setErrorMsg("Por favor, selecione uma cidade válida da lista.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        estrategia_id: estrategiaId,
        nome: nome,
        data_nascimento: dataNascimento,
        hora_nascimento: horaNascimento,
        cidade: cidadeSelecionada,
        data_inicio: dataInicio
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
      setResultado(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro desconhecido ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // RENDERIZAÇÃO DE RESULTADO
  // -----------------------------------------------------
  if (resultado) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <div className="bg-[var(--astro-card)] p-6 md:p-8 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden">
          
          {/* Efeito de brilho de fundo (Glassmorphism) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--astro-primary)] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--astro-primary)]">
                {resultado.estrategia_nome || "Sua Agenda Astrológica"}
              </h2>
              <button 
                onClick={() => setResultado(null)}
                className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity"
              >
                Voltar
              </button>
            </div>

            <div className="mb-8">
              <p className="text-sm opacity-80 mb-2">Calculado para:</p>
              <p className="font-semibold text-lg">{resultado.nome}</p>
              {resultado.identity && resultado.identity.local && (
                <p className="text-sm opacity-70 mt-1">{resultado.identity.local.cidade}</p>
              )}
              
              {resultado.identity && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm uppercase tracking-wider font-semibold opacity-60 mb-3">Identidade Astrológica</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'sol', label: 'Sol' },
                      { key: 'lua', label: 'Lua' },
                      { key: 'mercurio', label: 'Mercúrio' },
                      { key: 'venus', label: 'Vênus' },
                      { key: 'marte', label: 'Marte' },
                      { key: 'jupiter', label: 'Júpiter' },
                      { key: 'saturno', label: 'Saturno' },
                      { key: 'asc', label: 'Ascendente' },
                      { key: 'mc', label: 'Meio do Céu (MC)' }
                    ].map(planeta => {
                      const data = resultado.identity[planeta.key];
                      if (!data) return null;
                      return (
                        <div key={planeta.key} className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-center">
                          <span className="text-xs uppercase tracking-wider opacity-60 mb-1">{planeta.label}</span>
                          <span className="font-medium text-[var(--astro-primary)] text-sm">{data.texto}</span>
                          {planeta.key === 'asc' && data.regente_do_ascendente?.classico?.[0] && (
                            <span className="text-[10px] opacity-70 mt-1">Regente: {data.regente_do_ascendente.classico[0]}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Rodapé técnico discreto com report_id */}
                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] opacity-40 text-center uppercase tracking-widest leading-relaxed">
                    Sistema {resultado.identity.sistema_casas || 'Placidus'} · Zodíaco {resultado.identity.zodiaco || 'Tropical'} · {resultado.identity.efemerides || 'Swiss Ephemeris'}
                    {resultado.identity.report_id && <span className="block mt-1">ID: {resultado.identity.report_id}</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Janelas Temporais</h3>
              {resultado.janelas && resultado.janelas.length > 0 ? (
                resultado.janelas.map((janela: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-4 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col items-center justify-center min-w-[60px] bg-[var(--astro-primary)]/20 text-[var(--astro-primary)] rounded-md py-2">
                      <span className="text-2xl font-bold leading-none">{janela.day}</span>
                      <span className="text-xs uppercase tracking-wider font-semibold">{janela.mon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm opacity-80">Pico: {janela.pico}</span>
                      </div>
                      
                      {/* Renderizar as ações (Beleza, Força, etc.) */}
                      {janela.campos && Object.entries(janela.campos).map(([chave, info]: [string, any]) => (
                        <div key={chave} className="mt-2 text-sm border-l-2 border-[var(--astro-primary)] pl-3">
                          <strong className="block text-white/90">{info.label || chave}</strong>
                          <span className="opacity-70 text-xs block mt-1">Aspecto: {info.aspecto} ({info.orbe})</span>
                          <span className="opacity-70 text-xs block">Alvo: {info.natal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 opacity-60">
                  Nenhuma janela favorável encontrada para este período.
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/dashboard"
                className="inline-block py-3 px-8 rounded-full font-semibold transition-all duration-300 border border-[var(--astro-primary)] text-[var(--astro-primary)] hover:bg-[var(--astro-primary)] hover:text-[var(--astro-bg)]"
              >
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // RENDERIZAÇÃO DO FORMULÁRIO
  // -----------------------------------------------------
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[var(--astro-card)] p-6 md:p-8 rounded-2xl shadow-xl border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Geração de Agenda</h2>
          <Link href="/dashboard" className="text-sm font-semibold opacity-70 hover:opacity-100 hover:text-[var(--astro-primary)] transition-all">
            Cancelar
          </Link>
        </div>

        <p className="text-sm opacity-80 mb-6">
          Preencha os dados do mapa astral para que o Motor Kalon calcule os trânsitos exatos para esta estratégia.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors"
              placeholder="Ex: Roberto Gama"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="data_nascimento">Data Nasc.</label>
              <input
                id="data_nascimento"
                type="date"
                required
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="hora_nascimento">Hora Nasc.</label>
              <input
                id="hora_nascimento"
                type="time"
                required
                value={horaNascimento}
                onChange={(e) => setHoraNascimento(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="relative" ref={autocompleteRef}>
            <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="cidade">Cidade Natal</label>
            <input
              id="cidade"
              type="text"
              required
              autoComplete="off"
              value={cidadeBusca}
              onChange={handleCidadeChange}
              onFocus={() => setIsAutocompleteOpen(true)}
              className={`w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors ${cidadeSelecionada === null && cidadeBusca.length > 0 ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
              placeholder="Digite para buscar..."
            />
            {/* Aviso de que precisa selecionar da lista se estiver digitando e não selecionou */}
            {cidadeSelecionada === null && cidadeBusca.length > 0 && (
              <span className="absolute -bottom-5 left-1 text-xs text-red-400 opacity-80">
                Selecione uma cidade da lista.
              </span>
            )}
            
            {/* Dropdown de Autocomplete */}
            {isAutocompleteOpen && cidadesFiltradas.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl">
                {cidadesFiltradas.map(cid => (
                  <li 
                    key={cid.id} 
                    onClick={() => handleSelecionarCidade(cid.display)}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-colors border-b border-white/5 last:border-0"
                  >
                    {cid.display}
                  </li>
                ))}
              </ul>
            )}
            {isAutocompleteOpen && cidadeBusca.length > 0 && cidadesFiltradas.length === 0 && cidades.length > 0 && (
               <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl p-4 text-center text-sm opacity-60">
                 Cidade não encontrada.
               </ul>
            )}
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="data_inicio">Data de Início da Agenda</label>
            <input
              id="data_inicio"
              type="date"
              required
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors [color-scheme:dark]"
            />
          </div>

          {errorMsg && (
            <div className="text-sm text-red-400 mt-2 font-medium text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !cidadeSelecionada}
            className="mt-6 w-full py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg bg-[var(--astro-primary)] text-[var(--astro-bg)] hover:bg-[var(--astro-primary-dark)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[var(--astro-bg)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculando Trânsitos...
              </>
            ) : "Gerar Agenda Kalon"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col p-6 font-[family-name:var(--font-geist-sans)] bg-[var(--astro-bg)] text-[var(--astro-text)] relative">
      
      {/* Header Premium (mantendo identidade visual do dashboard) */}
      <header className="w-full flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <div 
              className="w-10 h-10 bg-[var(--astro-primary)] transition-transform duration-300 hover:scale-110 cursor-pointer"
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
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--astro-primary)] hidden sm:block">
            Kalon Astro
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-4">
            <svg className="animate-spin h-8 w-8 text-[var(--astro-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm opacity-70">Preparando formulário astral...</p>
          </div>
        }>
          <AgendaFormContent />
        </Suspense>
      </main>
    </div>
  );
}
