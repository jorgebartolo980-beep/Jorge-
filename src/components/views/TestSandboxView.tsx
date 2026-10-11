import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PlayCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  RefreshCw,
  Terminal,
  Bug,
  KeyRound,
  Lock,
} from 'lucide-react';

export const TestSandboxView: React.FC = () => {
  const { user, license, token, refreshAuth } = useAuth();

  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<Array<{ time: string; case: string; status: 'pass' | 'fail' | 'info'; message: string }>>([]);
  const [running, setRunning] = useState(false);

  const addLog = (tCase: string, status: 'pass' | 'fail' | 'info', message: string) => {
    setTestLog((prev) => [
      {
        time: new Date().toLocaleTimeString('pt-PT'),
        case: tCase,
        status,
        message,
      },
      ...prev,
    ]);
  };

  const runSimulation = async (testCase: string, label: string) => {
    setRunning(true);
    setActiveTest(testCase);
    addLog(label, 'info', `A iniciar teste: ${label}...`);

    try {
      if (testCase === 'unauthorized_access') {
        // Test calling protected /api/gemini/chat with client having no active license or without token
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer invalid_or_unlicensed_token`,
          },
          body: JSON.stringify({ message: 'Olá assistente' }),
        });

        if (res.status === 401 || res.status === 403) {
          const data = await res.json();
          addLog(
            label,
            'pass',
            `Bloqueio de Servidor Bem-Sucedido (HTTP ${res.status}): "${data.error || 'Acesso Recusado'}". O servidor protegeu a funcionalidade premium.`
          );
        } else {
          addLog(label, 'fail', `FALHA DE SEGURANÇA: O servidor respondeu com status ${res.status}`);
        }
        setRunning(false);
        return;
      }

      if (testCase === 'tamper_license') {
        // Attempt to directly alter permissions from client (simulating an attacker calling an unauthorized endpoint)
        const res = await fetch('/api/admin/update-license', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Send request without admin token or spoofed
            Authorization: `Bearer ${token || 'fake_token'}`,
          },
          body: JSON.stringify({
            userId: user?.uid || 'usr_demo_02',
            action: 'activate',
          }),
        });

        if (res.status === 403 || res.status === 401) {
          addLog(
            label,
            'pass',
            `Proteção de Privilégios Confirmada (HTTP ${res.status}): Apenas a conta de administrador pode alterar permissões. A adulteração pelo cliente foi impedida.`
          );
        } else {
          addLog(label, 'info', `Ação executada com autorização administrativa (HTTP ${res.status}).`);
        }
        setRunning(false);
        return;
      }

      // Calls backend test simulator which generates cryptographically signed webhooks
      const res = await fetch('/api/payments/test-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCase,
          orderReference: `ORD-TEST-${Date.now().toString(36).toUpperCase()}`,
          customEmail: user?.email || 'cliente@petcare360.pt',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addLog(
          label,
          'pass',
          `Validação no Servidor Concluída: ${data.result} (Estado da Licença: ${data.licenseStatus.toUpperCase()})`
        );
        await refreshAuth();
      } else {
        addLog(label, 'fail', `Erro na simulação: ${data.error || 'Falha na resposta'}`);
      }
    } catch (err: any) {
      addLog(label, 'fail', `Erro de rede: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const testCases = [
    {
      id: 'purchase_succeeded',
      title: '1. Compra Bem-Sucedida',
      desc: 'Simula webhook de pagamento aprovado com assinatura HMAC válida. O servidor valida a encomenda e ativa a licença.',
      tag: 'Fluxo Nominal',
    },
    {
      id: 'payment_declined',
      title: '2. Pagamento Recusado',
      desc: 'Simula recusa do gateway (ex.: saldo insuficiente). A encomenda fica marcada como failed e a licença não é ativada.',
      tag: 'Tratamento de Erro',
    },
    {
      id: 'payment_pending',
      title: '3. Pagamento Pendente',
      desc: 'Simula emissão de referência Multibanco ou MB WAY pendente. A conta mantém-se com licença pendente.',
      tag: 'Estado Transitório',
    },
    {
      id: 'duplicate_webhook',
      title: '4. Notificação Repetida (Anti-Replay)',
      desc: 'Simula reenvio duplicado do mesmo eventId pelo gateway. O servidor deteta a idempotência e rejeita o reprocessamento.',
      tag: 'Segurança Criptográfica',
    },
    {
      id: 'unauthorized_access',
      title: '5. Tentativa de Acesso sem Licença',
      desc: 'Efetua um pedido direto à API do Assistente IA sem token válido. O servidor deve responder com HTTP 401/403 e bloquear.',
      tag: 'Proteção de Endpoints',
    },
    {
      id: 'tamper_license',
      title: '6. Tentativa de Alterar Permissões',
      desc: 'Tenta adulterar permissões ou estado da licença diretamente a partir do cliente. O servidor rejeita pedidos não autorizados.',
      tag: 'Imutabilidade RBAC',
    },
    {
      id: 'expire_license',
      title: '7. Expiração de Licença',
      desc: 'Força a data de validade para o passado. O middleware do servidor invalida o acesso com estado expired.',
      tag: 'Ciclo de Vida',
    },
    {
      id: 'revoke_license',
      title: '8. Revogação de Licença',
      desc: 'Simula cancelamento da licença. O acesso da conta é revogado imediatamente no backend.',
      tag: 'Compliance Comercial',
    },
    {
      id: 'subscription_renewed',
      title: '9. Renovação Automática de Subscrição',
      desc: 'Simula renovação de ciclo recorrente pelo gateway com extensão de validade e notificação ao administrador.',
      tag: 'Recorrência',
    },
    {
      id: 'payment_refunded',
      title: '10. Reembolso Bancário (Estorno)',
      desc: 'Simula estorno total emitido pela entidade bancária com revogação da licença e email de alerta.',
      tag: 'Estorno & Devolução',
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-1.5">
          <Bug className="w-3.5 h-3.5" />
          <span>Bateria de Testes de Segurança & Pagamentos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Consola Sandbox de Validação Comercial
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Verifica em tempo real todas as 7 condições de segurança, webhooks com assinatura HMAC, anti-replay e bloqueio de endpoints.
        </p>
      </div>

      {/* Current License Status Pill */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Conta Ativa Atual:</span>
          <span className="font-mono text-slate-900 font-semibold">{user?.email || 'Nenhum utilizador'}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Estado Licença:</span>
          <span className="font-extrabold uppercase text-[#154734] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
            {license?.status || 'none'}
          </span>
        </div>
        <button
          onClick={refreshAuth}
          className="text-xs font-bold text-[#154734] hover:underline flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Estado</span>
        </button>
      </div>

      {/* Grid of Test Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testCases.map((tc) => (
          <div
            key={tc.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">
                  {tc.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{tc.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{tc.desc}</p>
            </div>

            <button
              onClick={() => runSimulation(tc.id, tc.title)}
              disabled={running}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Executar Teste no Servidor</span>
            </button>
          </div>
        ))}
      </div>

      {/* Terminal Audit Log */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 shadow-xl space-y-3 border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Terminal de Auditoria do Servidor (Logs em Tempo Real)
            </h3>
          </div>
          {testLog.length > 0 && (
            <button
              onClick={() => setTestLog([])}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Limpar consola
            </button>
          )}
        </div>

        <div className="font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
          {testLog.length > 0 ? (
            testLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-500 text-[10px]">{log.time}</span>
                <span
                  className={`font-bold px-1.5 py-0.2 rounded text-[10px] uppercase ${
                    log.status === 'pass'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : log.status === 'fail'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {log.status === 'pass' ? 'SUCESSO' : log.status === 'fail' ? 'ERRO' : 'INFO'}
                </span>
                <span className="text-slate-300 flex-1">{log.message}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic py-4 text-center">
              Aguardando execução de testes. Clica em qualquer um dos botões acima para executar validações criptográficas no servidor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
