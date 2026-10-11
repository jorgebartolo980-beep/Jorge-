import React from 'react';
import { usePetCare } from '../../context/PetCareContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePetCare();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white border-slate-700';
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-[#154734] text-white border-[#205c44] shadow-emerald-950/20';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-900 text-amber-50 border-amber-700 shadow-amber-950/20';
          icon = <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-900 text-rose-50 border-rose-700 shadow-rose-950/20';
          icon = <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm transition-all transform animate-in slide-in-from-bottom-2 duration-200 ${bg}`}
          >
            {icon}
            <div className="flex-1 font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:opacity-75 transition-opacity text-white/80"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
