import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlanType } from '../../types/auth';
import {
  ShieldCheck,
  Check,
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
  Info,
  Calendar,
  Bot,
  CreditCard,
  Building,
} from 'lucide-react';

interface PlansViewProps {
  onNavigateToCheckout: (planType?: PlanType) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({ onNavigateToCheckout }) => {
  const { user, license, isAuthenticated, hasActiveAccess, openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('mensal');

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
          Modelo Comercial & Licenças
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Planos Transparentes e Acesso Comercial
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          O PetCare 360 oferece acesso vitalício ou por subscrição com ativação automática através de notificação bancária autenticada (Webhook).
        </p>

        {/* Current User License Notice */}
        {isAuthenticated && (
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center justify-between max-w-lg mx-auto shadow-2xs">
            <div className="text-left">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">A tua conta:</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Licença Atual:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                hasActiveAccess
                  ? 'bg-emerald-100 text-[#154734]'
                  : license?.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {license?.status || 'none'}
              </span>
            </div>
          </div>
        )}

        {/* Billing cycle toggle */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold pt-2">
          <button
            onClick={() => setBillingCycle('mensal')}
            className={`px-4 py-2 rounded-xl transition-all ${
              billingCycle === 'mensal'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Faturação Mensal
          </button>
          <button
            onClick={() => setBillingCycle('anual')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              billingCycle === 'anual'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Faturação Anual</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#154734] font-extrabold">
              -18% Desconto
            </span>
          </button>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan 1: Gratuito */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Acesso Inicial
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">PetCare Básico</h3>
              <p className="text-xs text-slate-500 mt-1">
                Acesso às rotinas essenciais de acompanhamento diário.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">0 €</span>
              <span className="text-xs text-slate-400">/ gratuito</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Até 2 animais registados na conta</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Agenda de rotinas e calendário simples</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Diário de peso básico</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Centro de Saúde e Prevenção</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <span className="w-4 h-4 text-slate-300 shrink-0 mt-0.5">✕</span>
                <span className="line-through">Assistente PetCare AI ilimitado</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <span className="w-4 h-4 text-slate-300 shrink-0 mt-0.5">✕</span>
                <span className="line-through">Relatórios financeiros avançados</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="w-full block py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold text-center">
              Plano de Entrada
            </span>
          </div>
        </div>

        {/* Plan 2: PetCare Plus (Featured) */}
        <div className="relative p-7 rounded-3xl bg-white border-2 border-emerald-600 shadow-xl flex flex-col justify-between space-y-6">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#154734] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
            Mais Procurado
          </span>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Acesso Comercial Completo
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">PetCare Plus</h3>
              <p className="text-xs text-slate-500 mt-1">
                Todas as funcionalidades premium desbloqueadas no servidor após confirmação do pagamento.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#154734]">
                {billingCycle === 'mensal' ? '3,99 €' : '39,00 €'}
              </span>
              <span className="text-xs text-slate-400">
                {billingCycle === 'mensal' ? '/ mês' : '/ ano'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Animais ilimitados na mesma conta</span>
              </li>
              <li className="flex items-start gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Assistente Gemini com triagem inteligente</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Gestão financeira completa com gráficos de despesas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Histórico alargado de peso com alertas clínicos</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Certificados de conclusão dos módulos da Academia</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ativação automática via Webhook MB WAY / Multibanco</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {hasActiveAccess ? (
              <span className="w-full block py-2.5 rounded-xl bg-emerald-100 text-[#154734] text-xs font-bold text-center">
                ✓ Acesso Já Ativo na Tua Conta
              </span>
            ) : (
              <button
                onClick={() => onNavigateToCheckout(billingCycle === 'mensal' ? 'mensal' : 'anual')}
                className="w-full py-3 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold text-center shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Adquirir Acesso Comercial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Plan 3: Vitalício / Profissional */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pagamento Único
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Acesso Vitalício</h3>
              <p className="text-xs text-slate-500 mt-1">
                Uma única compra sem mensalidades para todas as funcionalidades presentes e futuras.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">99,00 €</span>
              <span className="text-xs text-slate-400">/ pagamento único</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Acesso vitalício sem data de expiração</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Todas as futuras funcionalidades incluídas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Suporte prioritário da equipa</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Emissão de fatura com NIF</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateToCheckout('vitalicio')}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold text-center transition-colors"
            >
              Adquirir Licença Vitalícia
            </button>
          </div>
        </div>
      </div>

      {/* Security Architecture Note */}
      <div className="p-6 rounded-3xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#154734]" />
          <span>Segurança de Pagamentos e Integridade do Servidor</span>
        </div>
        <p className="leading-relaxed">
          O PetCare 360 segue as melhores práticas de cibersegurança: o cliente nunca pode conceder licenças a si próprio alterando código ou redirecionamentos de URL. Apenas a notificação com assinatura criptográfica (HMAC-SHA256) enviada pelo gateway diretamente para o nosso servidor autoriza a ativação do serviço.
        </p>
      </div>
    </div>
  );
};
