import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminNotificationItem } from '../../types/auth';
import {
  ShieldAlert,
  Users,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Check,
  Ban,
  RefreshCw,
  ExternalLink,
  Lock,
  Receipt,
  FileText,
  PlayCircle,
  Mail,
  Send,
  Eye,
  AlertCircle,
  CheckCheck,
  X,
  Sparkles,
  Server,
  CreditCard,
} from 'lucide-react';

interface AdminViewProps {
  onNavigateToSandbox: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigateToSandbox }) => {
  const { token, isAdmin, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'licenses' | 'orders' | 'logs' | 'notifications'>('licenses');
  const [data, setData] = useState<{
    users: any[];
    licenses: any[];
    orders: any[];
    webhookLogs: any[];
    adminNotifications: AdminNotificationItem[];
    emailConfig?: {
      hasResendKey: boolean;
      hasSmtpConfig: boolean;
      recipientEmail: string;
      deliveryMode: string;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Email Notification Modal State
  const [selectedNotification, setSelectedNotification] = useState<AdminNotificationItem | null>(null);
  const [emailPreviewMode, setEmailPreviewMode] = useState<'html' | 'text'>('html');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  const fetchOverview = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Acesso recusado. Apenas administradores autorizados podem visualizar este painel.');
        }
        throw new Error('Erro ao carregar dados do painel.');
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de autorização.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [token]);

  const handleLicenseAction = async (userId: string, action: 'activate' | 'revoke' | 'expire' | 'extend') => {
    setActionSuccess(null);
    try {
      const res = await fetch('/api/admin/update-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, action }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionSuccess(json.message);
        fetchOverview();
      } else {
        setErrorMsg(json.error || 'Erro ao atualizar licença.');
      }
    } catch {
      setErrorMsg('Erro de comunicação.');
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setActionSuccess(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/test-email-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (res.ok) {
        setActionSuccess(json.message);
        fetchOverview();
      } else {
        setErrorMsg(json.error || 'Falha ao despachar email de teste.');
      }
    } catch (err: any) {
      setErrorMsg('Erro de comunicação ao disparar email de teste.');
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleResendNotification = async (notificationId: string) => {
    setActionSuccess(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/resend-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionSuccess(json.message);
        fetchOverview();
      } else {
        setErrorMsg(json.error || 'Falha ao reenviar notificação.');
      }
    } catch {
      setErrorMsg('Erro na ligação.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-white border border-rose-200 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Acesso Restrito ao Servidor</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Esta área é reservada à equipa de administração do PetCare 360 ({'jorgebartolo980@gmail.com'}). Inicie sessão com a conta de administrador para aceder.
        </p>
      </div>
    );
  }

  const usersList = data?.users || [];
  const licensesList = data?.licenses || [];
  const ordersList = data?.orders || [];
  const webhookLogs = data?.webhookLogs || [];
  const notificationsList = data?.adminNotifications || [];
  const emailConfig = data?.emailConfig;

  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.uid.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Área de Administração Autorizada • Servidor Seguro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel de Controlo Comercial & Notificações
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Consulta de clientes, auditoria de pagamentos, notificações de compras e gestão autorizada de licenças.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToSandbox}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Consola de Testes Sandbox</span>
          </button>
          <button
            onClick={fetchOverview}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Atualizar dados do servidor"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#154734] text-xs font-semibold flex items-center justify-between">
          <span>✓ {actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-800 font-bold">×</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Utilizadores</span>
          <span className="text-2xl font-extrabold text-slate-900">{usersList.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Licenças Ativas</span>
          <span className="text-2xl font-extrabold text-[#154734]">
            {licensesList.filter((l) => l.status === 'active').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pagamentos Pendentes</span>
          <span className="text-2xl font-extrabold text-amber-600">
            {licensesList.filter((l) => l.status === 'pending').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Webhooks Auditados</span>
          <span className="text-2xl font-extrabold text-purple-700">{webhookLogs.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Notificações Admin</span>
          <span className="text-2xl font-extrabold text-blue-700">{notificationsList.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 bg-white px-4 rounded-t-3xl pt-2">
        <button
          onClick={() => setActiveTab('licenses')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'licenses'
              ? 'border-[#154734] text-[#154734]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Gestão de Licenças ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-[#154734] text-[#154734]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Histórico de Encomendas ({ordersList.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'logs'
              ? 'border-[#154734] text-[#154734]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Auditoria de Webhooks ({webhookLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'border-[#154734] text-[#154734]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Notificações de Pagamentos</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
            activeTab === 'notifications' ? 'bg-[#154734] text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {notificationsList.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Licenses */}
      {activeTab === 'licenses' && (
        <div className="bg-white rounded-b-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por nome ou e-mail..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>
            <span className="text-xs text-slate-400">Ações com efeito instantâneo no servidor</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Utilizador</th>
                  <th className="p-4">Papel</th>
                  <th className="p-4">Estado da Licença</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Validade / Expiração</th>
                  <th className="p-4 text-right">Ações de Servidor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => {
                  const lic = licensesList.find((l) => l.userId === u.uid);
                  const status = lic?.status || 'none';

                  let badgeColor = 'bg-slate-100 text-slate-600';
                  if (status === 'active') badgeColor = 'bg-emerald-100 text-[#154734] font-bold';
                  if (status === 'pending') badgeColor = 'bg-amber-100 text-amber-800 font-bold';
                  if (status === 'expired') badgeColor = 'bg-rose-100 text-rose-700';
                  if (status === 'revoked') badgeColor = 'bg-red-100 text-red-800';

                  return (
                    <tr key={u.uid} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-slate-600">{u.role}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full uppercase text-[10px] ${badgeColor}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-4 capitalize">
                        {lic?.planType || '—'}
                      </td>
                      <td className="p-4 text-slate-500">
                        {lic?.expiresAt
                          ? new Date(lic.expiresAt).toLocaleDateString('pt-PT')
                          : lic?.planType === 'vitalicio'
                          ? 'Vitalício (Sem Expiração)'
                          : '—'}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {status !== 'active' ? (
                          <button
                            onClick={() => handleLicenseAction(u.uid, 'activate')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs"
                          >
                            Ativar
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleLicenseAction(u.uid, 'extend')}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                              title="Prolongar 30 dias"
                            >
                              +30 Dias
                            </button>
                            <button
                              onClick={() => handleLicenseAction(u.uid, 'revoke')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px]"
                            >
                              Revogar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-b-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Referência</th>
                  <th className="p-4">Comprador</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Método</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ordersList.map((ord) => (
                  <tr key={ord.orderReference}>
                    <td className="p-4 font-mono font-bold text-[#154734]">{ord.orderReference}</td>
                    <td className="p-4">{ord.userEmail}</td>
                    <td className="p-4 capitalize">{ord.planType}</td>
                    <td className="p-4 font-bold">{ord.amountEuro.toFixed(2)} €</td>
                    <td className="p-4 uppercase text-[10px] font-bold">{ord.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'completed' ? 'bg-emerald-100 text-[#154734]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(ord.createdAt).toLocaleDateString('pt-PT')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Webhook Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-b-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">ID Evento</th>
                  <th className="p-4">Referência</th>
                  <th className="p-4">Evento</th>
                  <th className="p-4">HMAC Assinatura</th>
                  <th className="p-4">Data Receção</th>
                  <th className="p-4">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-700">
                {webhookLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-bold">{log.eventId}</td>
                    <td className="p-4 text-[#154734]">{log.orderReference}</td>
                    <td className="p-4">{log.eventType}</td>
                    <td className="p-4">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Validada
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(log.receivedAt).toLocaleTimeString('pt-PT')}</td>
                    <td className="p-4 text-slate-500 font-sans">{log.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications for the Admin */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Notification Server Health & Config Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#154734]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Serviço de Notificações de Pagamentos do Servidor
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Destinatário oficial: <strong className="text-slate-800 font-mono">{emailConfig?.recipientEmail || 'jorgebartolo980@gmail.com'}</strong>
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400">Modo de Operação:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-[#154734]">
                    {emailConfig?.deliveryMode || 'Servidor Ativo'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-60"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingTestEmail ? 'animate-spin' : ''}`} />
                  <span>{isSendingTestEmail ? 'A disparar...' : 'Disparar Email de Teste'}</span>
                </button>
              </div>
            </div>

            {/* Email configuration helper */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Como funciona o envio de notificações por email para o administrador:</span>
              </div>
              <p className="leading-relaxed">
                Cada evento de pagamento (compra aprovada, subscrição renovada, pagamento recusado, reembolso ou cancelamento) gera instantaneamente uma notificação com identificador da transação, data/hora, montante, moeda, plano, estado, subscrição, e-mail do cliente e método de pagamento.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <strong className="block text-slate-800">Opção 1: Resend API (Recomendada)</strong>
                  <span>Basta definir <code>RESEND_API_KEY</code> no ficheiro <code>.env</code> para entrega direta na caixa de entrada.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <strong className="block text-slate-800">Opção 2: Servidor SMTP Próprio</strong>
                  <span>Configura <code>SMTP_HOST</code>, <code>SMTP_USER</code> e <code>SMTP_PASS</code> (ex: Gmail App Password ou Brevo).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Histórico de Notificações Registadas ({notificationsList.length})
                </h4>
                <span className="text-[11px] text-slate-400">
                  Todas as notificações autenticadas geradas pelo backend da PetCare 360
                </span>
              </div>
            </div>

            {notificationsList.length === 0 ? (
              <div className="p-12 text-center space-y-3 text-slate-400">
                <Mail className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">Ainda não existem notificações de pagamento registadas.</p>
                <button
                  onClick={handleSendTestEmail}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gerar Notificação de Demonstração</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="p-4">Evento & Estado</th>
                      <th className="p-4">Transação / Referência</th>
                      <th className="p-4">Plano & Montante</th>
                      <th className="p-4">Cliente (Email)</th>
                      <th className="p-4">Entrega</th>
                      <th className="p-4">Data / Hora</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {notificationsList.map((notif) => {
                      let statusBadge = 'bg-slate-100 text-slate-700';
                      if (notif.eventType.includes('succeeded') || notif.eventType.includes('renewed')) {
                        statusBadge = 'bg-emerald-100 text-[#154734] font-bold';
                      } else if (notif.eventType.includes('failed')) {
                        statusBadge = 'bg-rose-100 text-rose-700 font-bold';
                      } else if (notif.eventType.includes('refunded') || notif.eventType.includes('cancelled')) {
                        statusBadge = 'bg-amber-100 text-amber-800 font-bold';
                      }

                      return (
                        <tr key={notif.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${statusBadge}`}>
                              {notif.status}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                              {notif.eventType}
                            </span>
                          </td>
                          <td className="p-4 font-mono">
                            <div className="font-bold text-slate-900">{notif.transactionId}</div>
                            <div className="text-[11px] text-[#154734]">{notif.orderReference}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-[#154734] text-sm">
                              {notif.amountEuro.toFixed(2)} {notif.currency}
                            </div>
                            <div className="text-[11px] capitalize text-slate-500">{notif.planType}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-800">{notif.customerEmail}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">
                              Via {notif.paymentMethod}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              notif.deliveryStatus === 'sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : notif.deliveryStatus === 'failed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {notif.deliveryStatus === 'sent' ? '✓ Enviado' : notif.deliveryStatus === 'failed' ? 'Falha' : 'Registado Servidor'}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                              {notif.deliveryMethod}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 text-[11px]">
                            {new Date(notif.timestamp).toLocaleString('pt-PT')}
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedNotification(notif)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] inline-flex items-center gap-1"
                              title="Visualizar corpo do e-mail"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Ver Email</span>
                            </button>
                            <button
                              onClick={() => handleResendNotification(notif.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#154734] hover:bg-[#0f3426] text-white font-bold text-[11px] inline-flex items-center gap-1"
                              title="Reenviar alerta"
                            >
                              <Send className="w-3 h-3" />
                              <span>Reenviar</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#FAF9F5]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase text-[#154734] tracking-wider">
                  Auditoria de E-mail para Administrador
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-md">
                  {selectedNotification.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Controls */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span>Destinatário: <strong className="text-slate-800">{selectedNotification.recipient}</strong></span>
                <span>Data: <strong className="text-slate-800">{new Date(selectedNotification.timestamp).toLocaleString('pt-PT')}</strong></span>
              </div>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setEmailPreviewMode('html')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    emailPreviewMode === 'html' ? 'bg-[#154734] text-white' : 'text-slate-600'
                  }`}
                >
                  Visualização HTML
                </button>
                <button
                  onClick={() => setEmailPreviewMode('text')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    emailPreviewMode === 'text' ? 'bg-[#154734] text-white' : 'text-slate-600'
                  }`}
                >
                  Texto Simples
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-100">
              {emailPreviewMode === 'html' ? (
                <div
                  className="bg-white rounded-2xl shadow-xs overflow-hidden border border-slate-200"
                  dangerouslySetInnerHTML={{ __html: selectedNotification.emailHtml }}
                />
              ) : (
                <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-2xl whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {selectedNotification.emailText}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                ID: {selectedNotification.id} • Entrega: {selectedNotification.deliveryStatus} ({selectedNotification.deliveryMethod})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResendNotification(selectedNotification.id)}
                  className="px-4 py-2 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white font-bold inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reenviar Agora</span>
                </button>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
