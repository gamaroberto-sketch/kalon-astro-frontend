"use client";

import React from "react";

export interface Estrategia {
  id: string;
  nome: string;
  descricao: string;
  suite: string;
  modulo: string;
  versao: string;
  status: string;
}

interface GridEstrategiasProps {
  estrategias: Estrategia[];
  loadingEstrategias: boolean;
  errorMsg: string;
  onSelect: (estrategia_id: string) => void;
}

export default function GridEstrategias({
  estrategias,
  loadingEstrategias,
  errorMsg,
  onSelect
}: GridEstrategiasProps) {
  if (loadingEstrategias) {
    return <div className="text-center opacity-70 py-10">Carregando estratégias...</div>;
  }

  if (errorMsg) {
    return (
      <div className="text-center font-medium text-[var(--astro-primary)] py-10">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
      {estrategias.map((estrategia) => (
        <div 
          key={estrategia.id} 
          onClick={() => onSelect(estrategia.id)}
          className="flex flex-col justify-between h-full p-6 rounded-2xl bg-[var(--astro-card)] border border-white/5 transition-all duration-300 hover:border-[var(--astro-primary)] hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        >
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
          
          <div className="mt-6 flex justify-between items-end">
            <span className="text-xs opacity-40 uppercase tracking-widest font-mono">
              v{estrategia.versao}
            </span>
            <button className="px-4 py-2 bg-[var(--astro-primary)]/10 text-[var(--astro-primary)] hover:bg-[var(--astro-primary)] hover:text-black transition-colors rounded-lg text-xs font-bold uppercase tracking-wider">
              Gerar Calendário
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
