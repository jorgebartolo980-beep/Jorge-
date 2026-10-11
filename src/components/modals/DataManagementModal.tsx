import React, { useState } from 'react';
import { usePetCare } from '../../context/PetCareContext';
import { X, ShieldCheck, Download, Trash2, RefreshCw, AlertTriangle, Database } from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const {
    pets,
    tasks,
    diaryEntries,
    expenses,
    exportDataAsJson,
    resetAllData,
    restoreDemoData,
  } = usePetCare();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 text-[#154734]">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-[#154734]">
                Gestão de Dados & RGPD
              </h3>
              <p className="text-xs text-slate-500">
                Consulta, exporta ou elimina os teus dados com total controlo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Storage Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Resumo dos Dados Guardados Localmente
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="block text-lg font-extrabold text-[#154734]">{pets.length}</span>
                <span className="text-[11px] text-slate-500">Animais</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="block text-lg font-extrabold text-[#154734]">{tasks.length}</span>
                <span className="text-[11px] text-slate-500">Tarefas</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="block text-lg font-extrabold text-[#154734]">{diaryEntries.length}</span>
                <span className="text-[11px] text-slate-500">Diário</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="block text-lg font-extrabold text-[#154734]">{expenses.length}</span>
                <span className="text-[11px] text-slate-500">Despesas</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Os dados residem de forma privada no teu navegador. Nenhuma informação de cartões ou localização é recolhida.</span>
            </p>
          </div>

          {/* Action 1: Export JSON */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
            <div>
              <h5 className="text-xs font-bold text-slate-800">Exportar Dados (Direito à Portabilidade)</h5>
              <p className="text-[11px] text-slate-500">
                Descarrega um ficheiro JSON com todos os perfis, tarefas, medições de peso e despesas.
              </p>
            </div>
            <button
              onClick={() => {
                exportDataAsJson();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#154734] hover:bg-[#0f3426] text-white shadow-xs transition-colors shrink-0 ml-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>

          {/* Action 2: Restore Demo */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div>
              <h5 className="text-xs font-bold text-slate-800">Restaurar Dados de Demonstração</h5>
              <p className="text-[11px] text-slate-500">
                Repõe os perfis de exemplo do Pipoca, Simba e Luna com tarefas e despesas demonstrativas.
              </p>
            </div>
            <button
              onClick={() => {
                restoreDemoData();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shrink-0 ml-3"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restaurar</span>
            </button>
          </div>

          {/* Action 3: Delete / Forget */}
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Eliminar Todos os Dados Pessoais (Direito ao Esquecimento)</span>
                </h5>
                <p className="text-[11px] text-rose-700/80 mt-1">
                  Remove permanentemente todos os animais, registos e tarefas deste dispositivo. Esta ação não pode ser anulada.
                </p>
              </div>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shrink-0 border border-rose-300"
                >
                  Eliminar
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      resetAllData();
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                  >
                    Confirmar Eliminação
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
