"use client";

import React, { useState } from 'react';

type NivelAcesso = 'essencial' | 'explorador' | 'profissional';

interface KalonIdentityProps {
  identity: any;
  nivelPadrao?: NivelAcesso;
}

export default function KalonIdentity({ identity, nivelPadrao = 'essencial' }: KalonIdentityProps) {
  const [nivel, setNivel] = useState<NivelAcesso>(nivelPadrao);

  if (!identity) return null;

  const exibirProfissional = nivel === 'profissional';
  const exibirExplorador = nivel === 'explorador' || exibirProfissional;

  const planetas = [
    { key: 'sol', label: 'Sol', always: true },
    { key: 'lua', label: 'Lua', always: true },
    { key: 'asc', label: 'Ascendente', always: true },
    { key: 'mc', label: 'Meio do Céu (MC)', always: true },
    { key: 'mercurio', label: 'Mercúrio', always: false },
    { key: 'venus', label: 'Vênus', always: false },
    { key: 'marte', label: 'Marte', always: false },
    { key: 'jupiter', label: 'Júpiter', always: false },
    { key: 'saturno', label: 'Saturno', always: false },
  ];

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm uppercase tracking-wider font-semibold opacity-60">Identidade Astrológica</h3>
        
        <div className="flex bg-black/20 rounded-full p-1 border border-white/5 text-xs w-max">
          <button 
            onClick={() => setNivel('essencial')}
            className={`px-3 py-1.5 rounded-full transition-colors ${nivel === 'essencial' ? 'bg-[var(--astro-primary)] text-[var(--astro-bg)] font-semibold' : 'opacity-70 hover:opacity-100'}`}
          >
            {nivel === 'essencial' ? '◉' : '○'} Essencial
          </button>
          <button 
            onClick={() => setNivel('explorador')}
            className={`px-3 py-1.5 rounded-full transition-colors ${nivel === 'explorador' ? 'bg-[var(--astro-primary)] text-[var(--astro-bg)] font-semibold' : 'opacity-70 hover:opacity-100'}`}
          >
            {nivel === 'explorador' ? '◉' : '○'} Explorador
          </button>
          <button 
            onClick={() => setNivel('profissional')}
            className={`px-3 py-1.5 rounded-full transition-colors ${nivel === 'profissional' ? 'bg-[var(--astro-primary)] text-[var(--astro-bg)] font-semibold' : 'opacity-70 hover:opacity-100'}`}
          >
            {nivel === 'profissional' ? '◉' : '○'} Profissional
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {planetas.map(planeta => {
          if (!planeta.always && !exibirProfissional) return null;
          
          const data = identity[planeta.key];
          if (!data) return null;

          return (
            <div key={planeta.key} className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider opacity-60 mb-1">{planeta.label}</span>
              <span className="font-medium text-[var(--astro-primary)] text-sm">{data?.texto}</span>
              
              {planeta.key === 'asc' && data?.regente_do_ascendente && (
                <div className="mt-2 space-y-1">
                  {exibirExplorador && data.regente_do_ascendente.classico?.length > 0 && (
                    <div className="text-[10px] opacity-70">
                      Regente Clássico: {data.regente_do_ascendente.classico.join(' e ')}
                    </div>
                  )}
                  {exibirProfissional && data.regente_do_ascendente.moderno?.length > 0 && (
                    <div className="text-[10px] opacity-70">
                      Regente Moderno: {data.regente_do_ascendente.moderno.map((mod: string, idx: number) => {
                        const implementado = data.regente_do_ascendente.moderno_implementado?.[idx];
                        return (
                          <span key={idx}>
                            {idx > 0 && ' e '}
                            {mod} {implementado === false && <span title="Regente moderno não implementado">⚠</span>}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {exibirExplorador && (
        <div className="mt-4 pt-4 border-t border-white/5 text-[10px] opacity-40 text-center uppercase tracking-widest leading-relaxed">
          Sistema {identity?.sistema_casas || 'Placidus'} · Zodíaco {identity?.zodiaco || 'Tropical'} · {identity?.efemerides || 'Swiss Ephemeris'}
          {identity?.report_id && <span className="block mt-1">ID: {identity.report_id}</span>}
        </div>
      )}
    </div>
  );
}
