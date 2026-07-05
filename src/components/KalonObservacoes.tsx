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
    <div className="mt-8 pt-6 border-t border-white/10 space-y-6 print:border-gray-300 print:text-black">
      
      {o_que_e && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 print:bg-transparent print:border-gray-300">
          <h3 className="text-[var(--astro-primary)] font-semibold mb-2 print:text-black">
            {o_que_e.titulo || "O que é essa estratégia?"}
          </h3>
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap print:opacity-100 print:text-gray-800">
            {o_que_e.texto}
          </p>
        </div>
      )}

      {como_usar && como_usar.passos?.length > 0 && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 print:bg-transparent print:border-gray-300">
          <h3 className="text-[var(--astro-primary)] font-semibold mb-3 print:text-black">
            {como_usar.titulo || "Como Usar"}
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm opacity-80 marker:text-[var(--astro-primary)] print:opacity-100 print:text-gray-800 print:marker:text-black">
            {como_usar.passos.map((passo, idx) => (
              <li key={idx} className="leading-relaxed pl-2">{passo}</li>
            ))}
          </ol>
        </div>
      )}

      {observacoes && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 print:bg-transparent print:border-gray-300">
          <h3 className="text-[var(--astro-primary)] font-semibold mb-2 print:text-black">
            {observacoes.titulo || "Observações"}
          </h3>
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap print:opacity-100 print:text-gray-800">
            {observacoes.texto}
          </p>
        </div>
      )}

    </div>
  );
}
