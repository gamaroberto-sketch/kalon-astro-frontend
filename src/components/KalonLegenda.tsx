"use client";

import React from 'react';

export interface LegendaItem {
  icone: string;
  titulo: string;
  descricao: string;
  cor?: string;
}

interface KalonLegendaProps {
  legenda?: LegendaItem[];
}

export default function KalonLegenda({ legenda }: KalonLegendaProps) {
  if (!legenda || legenda.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 print:text-black">
      <h3 className="text-sm uppercase tracking-wider font-semibold opacity-60 mb-3 border-b border-white/10 pb-2 print:opacity-100 print:text-black print:border-gray-300">
        Legenda de Ações
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {legenda.map((item, idx) => {
          // Usa a cor vinda da API, ou um cinza neutro como fallback se não existir
          const cor = item.cor || '#888888';
          
          return (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors print:bg-transparent print:border-gray-300">
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 text-lg font-bold shrink-0 shadow-sm print:bg-transparent"
                style={{ color: cor, borderColor: `${cor}40`, borderWidth: '1px' }}
              >
                {item.icone}
              </div>
              <div className="flex-1">
                <strong className="block text-sm text-white/90 mb-1 print:text-black" style={{ color: cor }}>
                  {item.titulo}
                </strong>
                <p className="text-xs opacity-70 leading-relaxed print:opacity-100 print:text-gray-800">
                  {item.descricao}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
