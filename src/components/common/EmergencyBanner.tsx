import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, ChevronDown, ChevronUp, ShieldAlert, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Aviso de Emergência Veterinária" className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 text-white shadow-md border-b border-rose-700/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="p-1.5 rounded-lg bg-rose-700/80 text-white shrink-0 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div className="truncate sm:overflow-visible">
              <span className="font-bold tracking-wide uppercase text-rose-200 text-xs mr-2">
                Linha de Urgência & Segurança
              </span>
              <span className="text-rose-100 font-medium">
                Dificuldade respiratória, suspeita de veneno, convulsões ou colapso? Dirija-se de imediato a um hospital veterinário 24h.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-700/50 hover:bg-rose-600/60 text-xs font-semibold text-rose-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{expanded ? 'Ocultar Protocolo' : 'Ver Sinais Graves'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-rose-300 hover:text-white transition-colors"
              title="Fechar aviso"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-rose-700/40 text-xs text-rose-100 space-y-2.5">
            <p className="font-semibold text-white">
              Sinais que exigem atendimento imediato em urgência veterinária 24h (Não tente tratar em casa nem dê medicamentos humanos):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-rose-200">
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40">
                <span className="font-bold text-white block">1. Respiração & Tórax</span>
                Gengivas azuladas/pálidas, respiração pela boca em gatos, pieira estridente, sufoco ou engasgamento.
              </div>
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40">
                <span className="font-bold text-white block">2. Intoxicação & Abdómen</span>
                Ingestão de lírios por gatos, raticida, chocolate preto; barriga muito inchada e dura com vómito sem conteúdo (torção gástrica).
              </div>
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40">
                <span className="font-bold text-white block">3. Urinário & Neurológico</span>
                Gato a miar com dor na caixa sem urinar (obstrução); convulsões contínuas, pupilas desiguais ou atropelamento.
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-rose-300">
              <span>NUNCA administres paracetamol (fatal para gatos e cães), ibuprofeno ou tentes forçar vómito com sal.</span>
              <div className="flex items-center gap-1 font-semibold text-white bg-rose-800/80 px-2 py-0.5 rounded">
                <PhoneCall className="w-3 h-3 text-rose-300" />
                <span>Contacte o veterinário mais próximo ou ligue para o hospital com serviço 24h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
