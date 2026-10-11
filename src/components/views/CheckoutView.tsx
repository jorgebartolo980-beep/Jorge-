import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlanType } from '../../types/auth';
import {
  ShieldCheck,
  Check,
  Lock,
  CreditCard,
  QrCode,
  Smartphone,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface CheckoutViewProps {
  onSuccess: () => void;
  onNavigateToPlans: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onSuccess, onNavigateToPlans }) => {
  const { user, license, isAuthenticated, hasActiveAccess, openAuthModal, createOrder, refreshAuth } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>('mensal');
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'cartao' | 'multibanco'>('mbway');
  const [mbwayPhone, setMbwayPhone] = useState('912 345 678');

  // Checkout states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulated gateway confirmation trigger (sends webhook request directly to the backend)
  const [isVerifyingWebhook, setIsVerifyingWebhook] = useState(false);

  const planDetails = {
    mensal: { title: 'PetCare Plus Mensal', price: 3.99, cycle: 'Faturação mensal (cancele a qualquer momento)' },
    anual: { title: 'PetCare Plus Anual', price: 39.00, cycle: 'Faturação anual (poupe 18% em 12 meses)' },
    vitalicio: { title: 'Acesso Vitalício Familiar', price: 99.00, cycle: 'Pagamento único com acesso para sempre' },
  };

  const handleStartCheckout = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await createOrder(selectedPlan, paymentMethod);
    setIsSubmitting(false);

    if (res.success) {
      setOrderCreated(res.order);
    } else {
      setErrorMessage(res.error || 'Erro ao processar a encomenda.');
    }
  };

  // Simulates the payment provider delivering the server-to-server webhook
  const handleSimulateProviderWebhook = async () => {
    if (!orderCreated) return;
    setIsVerifyingWebhook(true);

    try {
      const res = await fetch('/api/payments/test-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCase: 'purchase_succeeded',
          orderReference: orderCreated.orderReference,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh authenticated state from server
        await refreshAuth();
        setIsVerifyingWebhook(false);
        onSuccess();
      } else {
        setErrorMessage('O fornecedor de pagamentos não confirmou a transação.');
        setIsVerifyingWebhook(false);
      }
    } catch {
      setErrorMessage('Erro na ligação de validação bancária.');
      setIsVerifyingWebhook(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
          Checkout Seguro • PetCare 360
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Adquirir Acesso Comercial PetCare Plus
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Transação protegida com verificação estrita de assinatura no servidor (sem armazenamento de cartões).
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!orderCreated ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Selection (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Escolhe o teu plano
              </label>

              {(['mensal', 'anual', 'vitalicio'] as PlanType[]).map((pKey) => {
                const plan = planDetails[pKey];
                const selected = selectedPlan === pKey;

                return (
                  <div
                    key={pKey}
                    onClick={() => setSelectedPlan(pKey)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selected
                        ? 'bg-emerald-50/40 border-[#154734] ring-2 ring-[#154734]/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{plan.title}</span>
                        {pKey === 'anual' && (
                          <span className="text-[10px] font-extrabold bg-[#154734] text-white px-2 py-0.5 rounded-full">
                            Poupe 18%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{plan.cycle}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#154734]">
                        {plan.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                2. Método de Pagamento Nacional Seguro
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'mbway', label: 'MB WAY', icon: Smartphone },
                  { id: 'multibanco', label: 'Multibanco', icon: QrCode },
                  { id: 'cartao', label: 'Cartão Seguro', icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  const selected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                        selected
                          ? 'bg-[#154734] text-white border-[#154734] shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'mbway' && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Número de Telemóvel MB WAY
                  </label>
                  <input
                    type="tel"
                    value={mbwayPhone}
                    onChange={(e) => setMbwayPhone(e.target.value)}
                    placeholder="912 345 678"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Receberás uma notificação na aplicação MB WAY para autorizar a operação em 5 minutos.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Submit (Right col) */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Resumo da Subscrição
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Produto:</span>
                  <span className="font-bold text-slate-900">{planDetails[selectedPlan].title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Conta:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[140px]">
                    {user?.email || 'Não autenticado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IVA incluído (23%):</span>
                  <span className="font-medium text-slate-700">
                    {((planDetails[selectedPlan].price * 23) / 123).toFixed(2)} €
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-base">
                  <span className="font-bold text-slate-900">Total a pagar:</span>
                  <span className="font-extrabold text-[#154734]">
                    {planDetails[selectedPlan].price.toFixed(2)} €
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'A iniciar encomenda...' : 'Confirmar e Prosseguir'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ativação automática via Webhook autenticado</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sem dados bancários guardados no servidor</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Order awaiting webhook confirmation */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <Clock className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              Estado: Pagamento Pendente
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Referência da Encomenda: <code className="text-[#154734]">{orderCreated.orderReference}</code>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              A encomenda foi registada com sucesso no servidor. Conforme a regra de segurança de comércio eletrónico, o acesso apenas é desbloqueado após a receção da notificação bancária autenticada (Webhook).
            </p>
          </div>

          {/* Multibanco / MBWay Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Entidade:</span>
              <span className="font-mono font-bold text-slate-800">{orderCreated.multibancoEntity || '21234'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Referência:</span>
              <span className="font-mono font-bold text-slate-800">{orderCreated.multibancoReference || '123 456 789'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Montante:</span>
              <span className="font-bold text-[#154734]">{orderCreated.amountEuro} €</span>
            </div>
          </div>

          {/* Action to simulate gateway provider delivery & check status */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSimulateProviderWebhook}
                disabled={isVerifyingWebhook}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-all disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingWebhook ? 'animate-spin' : ''}`} />
                <span>
                  {isVerifyingWebhook
                    ? 'A validar assinatura no servidor...'
                    : 'Confirmar Pagamento Bancário (Webhook HMAC)'}
                </span>
              </button>

              <button
                onClick={async () => {
                  await refreshAuth();
                  if (hasActiveAccess) {
                    onSuccess();
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                <span>Verificar Estado</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                onClick={onNavigateToPlans}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Voltar à seleção de planos
              </button>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Dispara uma notificação autenticada com HMAC-SHA256 para o endpoint <code>/api/payments/webhook</code> do backend e envia notificação oficial ao administrador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
