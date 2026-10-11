import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    forgotPassword,
    resetPassword,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Credenciais inválidas.');
      }
    } else if (authModalMode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('As palavras-passe introduzidas não coincidem.');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Não foi possível criar a conta.');
      }
    } else if (authModalMode === 'forgot') {
      if (isResetting) {
        const res = await resetPassword(resetToken, password);
        if (res.success) {
          setSuccessMsg(res.message || 'Palavra-passe alterada!');
          setTimeout(() => openAuthModal('login'), 2000);
        } else {
          setErrorMsg(res.error || 'Erro ao redefinir palavra-passe.');
        }
      } else {
        const res = await forgotPassword(email);
        if (res.success) {
          setSuccessMsg(res.message || 'Instruções enviadas.');
          if (res.resetTokenForDemo) {
            setResetToken(res.resetTokenForDemo);
            setIsResetting(true);
          }
        } else {
          setErrorMsg(res.error || 'Erro ao processar o pedido.');
        }
      }
    }

    setLoading(false);
  };

  const handleQuickFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-[#154734]">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#154734]">
                {authModalMode === 'login' && 'Iniciar Sessão'}
                {authModalMode === 'register' && 'Criar Nova Conta'}
                {authModalMode === 'forgot' && 'Recuperar Acesso'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Plataforma Comercial PetCare 360
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 text-[#154734] border border-emerald-200 rounded-xl">
              {successMsg}
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex.: Maria Silva"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          {(!isResetting || authModalMode !== 'forgot') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Endereço de E-mail *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex.: tutor@exemplo.pt"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
                />
              </div>
            </div>
          )}

          {/* Reset Token if in step 2 of forgot */}
          {authModalMode === 'forgot' && isResetting && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Código de Redefinição *
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Código recebido por e-mail"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none font-mono"
              />
            </div>
          )}

          {/* Password field */}
          {(authModalMode !== 'forgot' || isResetting) && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {authModalMode === 'forgot' ? 'Nova Palavra-passe *' : 'Palavra-passe *'}
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetting(false);
                      openAuthModal('forgot');
                    }}
                    className="text-[11px] font-semibold text-[#154734] hover:underline"
                  >
                    Esqueceu-se?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmar Palavra-passe *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a palavra-passe"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>
              {loading
                ? 'A processar...'
                : authModalMode === 'login'
                ? 'Entrar na Conta'
                : authModalMode === 'register'
                ? 'Criar Conta'
                : isResetting
                ? 'Guardar Nova Palavra-passe'
                : 'Enviar Pedido de Redefinição'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick Demo Credentials Assistant */}
          {authModalMode === 'login' && (
            <div className="pt-3 border-t border-slate-100 text-[11px] space-y-2">
              <span className="text-slate-400 block font-semibold">Contas pré-configuradas para teste rápido:</span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('jorgebartolo980@gmail.com', 'Admin123!')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-left text-[#154734] font-medium border border-emerald-200/60 flex items-center justify-between"
                >
                  <span>👑 Administrador: <strong>jorgebartolo980@gmail.com</strong></span>
                  <span className="text-[10px] bg-[#154734] text-white px-1.5 py-0.5 rounded">Preencher</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('cliente@petcare360.pt', 'Cliente123!')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-left text-slate-700 font-medium border border-slate-200 flex items-center justify-between"
                >
                  <span>👤 Cliente Sem Licença: <strong>cliente@petcare360.pt</strong></span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Preencher</span>
                </button>
              </div>
            </div>
          )}

          {/* Switch Mode Footer */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {authModalMode === 'login' ? (
              <>
                Ainda não tens conta?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-bold text-[#154734] hover:underline"
                >
                  Regista-te aqui
                </button>
              </>
            ) : (
              <>
                Já tens uma conta?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-[#154734] hover:underline"
                >
                  Iniciar sessão
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
