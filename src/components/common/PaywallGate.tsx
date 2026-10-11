import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Sparkles, ShieldCheck, ArrowRight, UserCheck, CheckCircle2, Heart } from 'lucide-react';

interface PaywallGateProps {
  onNavigateToPlans: () => void;
  title?: string;
  featureDescription?: string;
}

export const PaywallGate: React.FC<PaywallGateProps> = ({
  onNavigateToPlans,
  title = 'Funcionalidade Exclusiva PetCare Plus',
  featureDescription = 'O Assistente Inteligente com IA contextualizada, os relatórios avançados de despesas e os módulos de certificação exigem uma licença ativa.',
}) => {
  const { isAuthenticated, openAuthModal, license } = useAuth();

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Emblem */}
      <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-[#154734] border border-emerald-200 flex items-center justify-center shadow-xs">
        <Lock className="w-8 h-8 text-[#154734]" />
      </div>

      {/* Required Prompt Message (Section 5) */}
      <div className="space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-[#154734]">
          Acesso Pago Comercial
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          A PetCare 360 está pronta para te ajudar a cuidar melhor do teu companheiro.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
          Adquire o teu acesso para desbloquear as funcionalidades premium.
        </p>
      </div>

      {/* Feature perks preview */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200/80 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Vantagens do teu acesso comercial:</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Assistente IA contextualizado com o historial de saúde e peso</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Deteção imediata de urgências e triagem com directrizes clínicas</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Gestão financeira completa com exportação e certificações</span>
        </div>
      </div>

      {/* License status indicator if logged in */}
      {isAuthenticated && license && (
        <div className="text-xs text-slate-500">
          Estado atual da tua conta: <strong className="uppercase text-[#154734]">{license.status}</strong>
          {license.status === 'pending' && ' (A aguardar confirmação bancária)'}
          {license.status === 'expired' && ' (O teu período de licença terminou)'}
          {license.status === 'revoked' && ' (O teu acesso foi revogado)'}
        </div>
      )}

      {/* Action Buttons as explicitly requested in Section 5 */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onNavigateToPlans}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs sm:text-sm font-bold shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <span>Conhecer os planos</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {!isAuthenticated ? (
          <button
            onClick={() => openAuthModal('login')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Iniciar sessão</span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
          >
            <span>Trocar de Conta</span>
          </button>
        )}
      </div>
    </div>
  );
};
