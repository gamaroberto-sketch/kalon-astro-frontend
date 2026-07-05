"use client";

import React, { useMemo, useState, useRef } from 'react';
import { toPng } from 'html-to-image';

interface JanelaCampo {
  label: string;
  icone: string;
  cor: string;
  auditoria?: Array<{
    titulo: string;
    itens: Array<{ label: string; valor: string }>;
  }>;
  // Outras props existem mas o frontend não as avalia
}

interface Janela {
  date_key: string;
  day: string;
  mon: string;
  pico: string;
  inicio?: string;
  fim?: string;
  ativos: string[];
  campos: Record<string, JanelaCampo>;
}

interface AgendaKalonProps {
  janelas?: Janela[];
  nome: string;
}

export default function AgendaKalon({ janelas, nome }: AgendaKalonProps) {
  const [linhaExpandida, setLinhaExpandida] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [exportando, setExportando] = useState(false);

  // 1. Extração dinâmica das colunas com label amigável
  const colunas = useMemo(() => {
    if (!janelas) return [];
    const chavesMap = new Map<string, string>();
    janelas.forEach(j => {
      if (j.campos) {
        Object.entries(j.campos).forEach(([k, info]) => {
          if (!chavesMap.has(k)) {
            chavesMap.set(k, info.label || k);
          }
        });
      }
    });
    return Array.from(chavesMap.entries()).map(([key, label]) => ({ key, label }));
  }, [janelas]);

  // 2. Próxima oportunidade (fuso horário local via ISO parse)
  const proximaJanela = useMemo(() => {
    if (!janelas || janelas.length === 0) return null;
    const agora = new Date();
    
    return janelas.find(j => {
      // date_key (YYYY-MM-DD) + pico (HH:MM) => "YYYY-MM-DDT14:30:00"
      // Sem o 'Z', o Date assume timezone local automaticamente.
      const dateStr = `${j.date_key}T${j.pico}:00`;
      const dataJanela = new Date(dateStr);
      return dataJanela > agora;
    });
  }, [janelas]);

  const diasLabel = useMemo(() => {
    if (!proximaJanela) return null;
    const agora = new Date();
    agora.setHours(0,0,0,0);
    const [ano, mes, dia] = proximaJanela.date_key.split('-').map(Number);
    const dataProx = new Date(ano, mes - 1, dia);
    const diffDias = Math.round((dataProx.getTime() - agora.getTime()) / 86400000);
    return diffDias === 0 ? 'Hoje!' : diffDias === 1 ? 'em 1 dia' : `em ${diffDias} dias`;
  }, [proximaJanela]);

  // 3. Exportação PNG
  const handleExportPNG = async () => {
    if (!tableRef.current) return;
    try {
      setExportando(true);
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: '#0f0f11', // Cor base do tema para evitar fundo transparente zoado
        pixelRatio: 2 // Maior resolução
      });
      const link = document.createElement('a');
      link.download = `Agenda_${nome.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao exportar PNG", err);
      alert("Não foi possível gerar a imagem da agenda.");
    } finally {
      setExportando(false);
    }
  };

  if (!janelas || janelas.length === 0) {
    return (
      <div className="text-center py-8 opacity-60">
        Nenhuma janela favorável encontrada para este período.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8 print:text-black print:bg-white">
      {/* Cabeçalho da Agenda */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold print:text-black">Janelas Temporais</h3>
          <p className="text-sm opacity-70 mt-1 print:opacity-100 print:text-gray-700">Estratégias calculadas com precisão para {nome}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            🖨 Imprimir
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            ⬇ Salvar PDF
          </button>
          <button
            onClick={handleExportPNG}
            disabled={exportando}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {exportando ? "Gerando..." : "📸 Salvar PNG"}
          </button>
        </div>
      </div>

      {/* Próxima Oportunidade */}
      {proximaJanela && (
        <div className="bg-[var(--astro-primary)]/10 border border-[var(--astro-primary)]/30 rounded-xl p-4 flex items-center justify-between print:bg-white print:border-[var(--astro-primary)] print:border-2">
          <div>
            <h4 className="text-[var(--astro-primary)] text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              Próxima Oportunidade <span className="bg-[var(--astro-primary)] text-black px-2 py-0.5 rounded-full text-[10px] font-black print:border print:border-black">{" "}{diasLabel}</span>
            </h4>
            <p className="text-sm opacity-90 print:opacity-100 print:text-black">
              Sua próxima janela se abre dia <strong>{proximaJanela.day} de {proximaJanela.mon}</strong> às <strong>{proximaJanela.pico}</strong>.
            </p>
          </div>
          <div className="hidden sm:flex text-[var(--astro-primary)] text-3xl font-light print:text-black">
            {proximaJanela.day}
          </div>
        </div>
      )}

      {/* Área da Tabela (capturada no print) */}
      <div ref={tableRef} className="bg-[var(--astro-card)] p-4 rounded-xl overflow-x-auto print:overflow-visible print:h-auto print:bg-white print:p-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 print:border-gray-400">
              <th className="py-3 px-4 text-xs uppercase tracking-wider opacity-60 font-medium print:opacity-100 print:text-gray-800">Data</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider opacity-60 font-medium print:opacity-100 print:text-gray-800">Pico</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider opacity-60 font-medium whitespace-nowrap print:opacity-100 print:text-gray-800">Janela</th>
              <th className="py-3 px-4 text-xs uppercase tracking-wider opacity-60 font-medium print:opacity-100 print:text-gray-800">Objetivo</th>
              {colunas.map(col => (
                <th key={col.key} className="py-3 px-4 text-xs uppercase tracking-wider opacity-60 font-medium text-center print:opacity-100 print:text-gray-800">{col.label}</th>
              ))}
              <th className="py-3 px-4 w-8 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {janelas.map((janela, idx) => {
              const isExpanded = linhaExpandida === idx;
              const ativos = colunas.filter(col => janela.campos?.[col.key]).map(col => col.label);
              
              return (
                <React.Fragment key={idx}>
                  {/* Linha Principal */}
                  <tr 
                    onClick={() => setLinhaExpandida(isExpanded ? null : idx)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group print:border-gray-300 print:hover:bg-transparent"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-black/20 rounded-lg border border-white/5 print:bg-transparent print:border-gray-300">
                        <span className="text-lg font-bold leading-none print:text-black">{janela.day}</span>
                        <span className="text-[10px] uppercase font-semibold text-[var(--astro-primary)] print:text-black">{janela.mon}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-sm opacity-80 print:opacity-100 print:text-black">{janela.pico}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-sm opacity-80 print:opacity-100 print:text-black">{janela.inicio} → {janela.fim}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium print:text-black">{ativos.length > 0 ? ativos.join(' + ') : 'Janela Neutra'}</span>
                    </td>
                    
                    {/* Células de Critérios */}
                    {colunas.map(col => {
                      const campoInfo = janela.campos?.[col.key];
                      return (
                        <td key={col.key} className="py-4 px-4 text-center">
                          {campoInfo ? (
                            <div className="flex flex-col items-center justify-center">
                              <span 
                                className="text-xl" 
                                style={{ color: campoInfo.cor || '#fff' }}
                                title={campoInfo.label}
                              >
                                {campoInfo.icone}
                              </span>
                            </div>
                          ) : (
                            <span className="opacity-20">-</span>
                          )}
                        </td>
                      );
                    })}
                    
                    {/* FD-107: Chevron indicador de expansão */}
                    <td className="py-4 px-4 text-center text-xl opacity-30 group-hover:opacity-100 transition-opacity print:hidden">
                      {isExpanded ? '▾' : '›'}
                    </td>
                  </tr>
                  
                  {/* Linha de Detalhe (Auditoria) */}
                  {isExpanded && (
                    <tr className="bg-black/30 border-b border-white/10 print:bg-white print:border-gray-400">
                      <td colSpan={colunas.length + 5} className="py-6 px-6">
                        <div className="text-xs uppercase tracking-widest opacity-50 mb-4 font-semibold print:opacity-100 print:text-black">Detalhamento Astrológico</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {colunas.map(col => {
                            const campoInfo = janela.campos?.[col.key];
                            if (!campoInfo || !campoInfo.auditoria || campoInfo.auditoria.length === 0) return null;
                            
                            return (
                              <div key={col.key} className="bg-white/5 p-4 rounded-lg border border-white/5 print:bg-transparent print:border-gray-300">
                                <div className="flex items-center gap-2 mb-3">
                                  <span style={{ color: campoInfo.cor || '#fff' }}>{campoInfo.icone}</span>
                                  <h5 className="font-semibold text-sm" style={{ color: campoInfo.cor || '#fff' }}>{campoInfo.label || col.label}</h5>
                                </div>
                                <div className="space-y-3">
                                  {campoInfo.auditoria.map((audItem, audIdx) => (
                                    <div key={audIdx} className="space-y-1">
                                      <strong className="block text-xs opacity-70 print:opacity-100 print:text-gray-800">{audItem.titulo}</strong>
                                      {audItem.itens?.map((detalhe, detIdx) => (
                                        <div key={detIdx} className="text-xs flex justify-between border-b border-white/5 pb-1 mb-1 last:border-0 last:pb-0 last:mb-0 print:border-gray-300">
                                          <span className="opacity-60 print:opacity-100 print:text-gray-600">{detalhe.label}</span>
                                          <span className="font-medium print:text-black">{detalhe.valor}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
