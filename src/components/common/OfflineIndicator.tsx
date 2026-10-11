import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Aviso de ligação offline"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-md border border-amber-400/40 animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
      <div>
        <p className="font-semibold text-white leading-tight">Modo Offline Ativo</p>
        <p className="text-[11px] text-amber-100/90 leading-tight">
          A carregar recursos seguros em cache local.
        </p>
      </div>
    </aside>
  );
};
