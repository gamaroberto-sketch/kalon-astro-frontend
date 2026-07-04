"use client";

import React from 'react';

interface ComoUsar {
  titulo?: string;
  passos: string[];
}

interface ObservacoesProps {
  o_que_e?: { titulo?: string; texto: string };
  como_usar?: ComoUsar;
  observacoes?: { titulo?: string; texto: string };
}

export default function KalonObservacoes({ o_que_e, como_usar, observacoes }: ObservacoesProps) {
  if (!o_que_e && !como_usar && !observacoes) return null;

  return (
    <div className="mt-8 pt-6 border-t border-white/10 space-y-6">
      
      {o_que_e && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h3 className="text-[var(--astro-primary)] font-semibold mb-2">
            {o_que_e.titulo || "O que é essa estratégia?"}
          </h3>
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
            {o_que_e.texto}
          </p>
        </div>
      )}

      {como_usar && como_usar.passos?.length > 0 && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h3 className="text-[var(--astro-primary)] font-semibold mb-3">
            {como_usar.titulo || "Como Usar"}
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm opacity-80 marker:text-[var(--astro-primary)]">
            {como_usar.passos.map((passo, idx) => (
              <li key={idx} className="leading-relaxed pl-2">{passo}</li>
            ))}
          </ol>
        </div>
      )}

      {observacoes && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h3 className="text-[var(--astro-primary)] font-semibold mb-2">
            {observacoes.titulo || "Observações"}
          </h3>
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
            {observacoes.texto}
          </p>
        </div>
      )}

    </div>
  );
}
