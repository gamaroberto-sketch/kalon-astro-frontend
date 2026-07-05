"use client";

import React, { useState, useEffect, useRef } from "react";

interface Cidade {
  id: string;
  nome: string;
  estado: string;
  display: string;
}

export interface FormDados {
  nome: string;
  dataNascimento: string;
  horaNascimento: string;
  cidadeSelecionada: string | null;
  dataInicio: string;
}

interface FormularioKalonProps {
  dados: FormDados;
  cidadeBusca: string;
  onDadosChange: (dados: Partial<FormDados>) => void;
  onCidadeBuscaChange: (busca: string) => void;
  disabled?: boolean;
}

export default function FormularioKalon({
  dados,
  cidadeBusca,
  onDadosChange,
  onCidadeBuscaChange,
  disabled
}: FormularioKalonProps) {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadesFiltradas, setCidadesFiltradas] = useState<Cidade[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (cidadeBusca.trim() === "") {
      setCidadesFiltradas([]);
      return;
    }
    if (dados.cidadeSelecionada && cidadeBusca === dados.cidadeSelecionada) {
      setCidadesFiltradas([]);
      return;
    }
    const termo = cidadeBusca.toLowerCase();
    const filtradas = cidades.filter(c => 
      c.display.toLowerCase().includes(termo)
    ).slice(0, 10);
    
    setCidadesFiltradas(filtradas);
  }, [cidadeBusca, cidades, dados.cidadeSelecionada]);

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
    onDadosChange({ cidadeSelecionada: cidadeDisplay });
    onCidadeBuscaChange(cidadeDisplay);
    setIsAutocompleteOpen(false);
  };

  const handleCidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCidadeBuscaChange(e.target.value);
    onDadosChange({ cidadeSelecionada: null });
    setIsAutocompleteOpen(true);
  };

  return (
    <div className="bg-[var(--astro-card)] p-6 md:p-8 rounded-2xl shadow-xl border border-white/5 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Dados do Mapa Astral</h2>
      </div>

      <p className="text-sm opacity-80 mb-6">
        Preencha os dados do mapa astral para que o Motor Kalon calcule os trânsitos exatos.
      </p>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="nome">Nome Completo</label>
          <input
            id="nome"
            type="text"
            required
            disabled={disabled}
            value={dados.nome}
            onChange={(e) => onDadosChange({ nome: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors disabled:opacity-50"
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
              disabled={disabled}
              value={dados.dataNascimento}
              onChange={(e) => onDadosChange({ dataNascimento: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors [color-scheme:dark] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80" htmlFor="hora_nascimento">Hora Nasc.</label>
            <input
              id="hora_nascimento"
              type="time"
              required
              disabled={disabled}
              value={dados.horaNascimento}
              onChange={(e) => onDadosChange({ horaNascimento: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors [color-scheme:dark] disabled:opacity-50"
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
            disabled={disabled}
            value={cidadeBusca}
            onChange={handleCidadeChange}
            onFocus={() => setIsAutocompleteOpen(true)}
            className={`w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors disabled:opacity-50 ${dados.cidadeSelecionada === null && cidadeBusca.length > 0 ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
            placeholder="Digite para buscar..."
          />
          {dados.cidadeSelecionada === null && cidadeBusca.length > 0 && (
            <span className="absolute -bottom-5 left-1 text-xs text-red-400 opacity-80">
              Selecione uma cidade da lista.
            </span>
          )}
          
          {isAutocompleteOpen && cidadesFiltradas.length > 0 && !disabled && (
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
          {isAutocompleteOpen && cidadeBusca.length > 0 && cidadesFiltradas.length === 0 && cidades.length > 0 && !disabled && (
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
            disabled={disabled}
            value={dados.dataInicio}
            onChange={(e) => onDadosChange({ dataInicio: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-[var(--astro-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--astro-primary)] transition-colors [color-scheme:dark] disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
