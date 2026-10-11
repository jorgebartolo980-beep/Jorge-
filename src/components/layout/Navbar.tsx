import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { usePetCare } from '../../context/PetCareContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  HeartPulse,
  Bot,
  Receipt,
  Heart,
  Sparkles,
  Menu,
  X,
  Plus,
  ShieldCheck,
  ChevronDown,
  PawPrint,
  Clock,
  User,
  Lock,
  LogOut,
  ShieldAlert,
  PlayCircle,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenNewPetModal: () => void;
  onOpenDataModal: () => void;
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenNewPetModal,
  onOpenDataModal,
  onOpenCheckout,
}) => {
  const { pets, activePet, setActivePetId } = usePetCare();
  const { user, license, isAuthenticated, isAdmin, hasActiveAccess, openAuthModal, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Início', icon: Sparkles },
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'pets', label: 'Animais', icon: PawPrint, badge: pets.length },
    { id: 'calendar', label: 'Calendário', icon: CalendarDays },
    { id: 'diary', label: 'Diário', icon: Clock },
    { id: 'expenses', label: 'Despesas', icon: Receipt },
    { id: 'academy', label: 'Academia', icon: BookOpen },
    { id: 'health', label: 'Saúde', icon: HeartPulse },
    { id: 'assistant', label: 'Assistente IA', icon: Bot, isPremium: true },
    { id: 'adoption', label: 'Adoção', icon: Heart },
    { id: 'plans', label: 'Planos', icon: CreditCard },
    { id: 'publish', label: 'App Android', icon: Smartphone },
  ];

  const handleNav = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none rounded-xl"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;

              if (link.isPremium) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#154734] text-white shadow-sm ring-2 ring-emerald-600/30'
                        : hasActiveAccess
                        ? 'bg-emerald-50 text-[#154734] hover:bg-emerald-100 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{link.label}</span>
                    {!hasActiveAccess ? (
                      <Lock className="w-3 h-3 text-amber-700 ml-0.5" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#154734]/10 text-[#154734]'
                      : 'text-slate-600 hover:text-[#154734] hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#154734]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin link if user is admin */}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentView === 'admin'
                    ? 'bg-rose-100 text-rose-900'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin</span>
              </button>
            )}

            {/* Sandbox link */}
            <button
              onClick={() => handleNav('sandbox')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentView === 'sandbox'
                  ? 'bg-purple-100 text-purple-900'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
              title="Consola de Testes Sandbox"
            >
              <PlayCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Testes</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* PWA Install Button */}
            <PWAInstallButton variant="outline" label="Instalar App" className="hidden lg:inline-flex" />

            {/* Active Pet Selector */}
            {pets.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-slate-200 bg-[#FAF9F5] hover:bg-white transition-all shadow-xs"
                  title="Selecionar animal ativo"
                >
                  <img
                    src={activePet?.photoUrl}
                    alt={activePet?.name || 'Animal'}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-800/30"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {activePet?.name}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {petDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Alternar Animal
                    </div>
                    {pets.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePetId(p.id);
                          setPetDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors ${
                          p.id === activePet?.id
                            ? 'bg-[#154734]/10 text-[#154734] font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img src={p.photoUrl} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate flex-1">{p.name}</span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                      <button
                        onClick={() => {
                          setPetDropdownOpen(false);
                          onOpenNewPetModal();
                        }}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-[#154734] hover:bg-emerald-50 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Animal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authentication / User License State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#154734] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user?.name?.split(' ')[0]}
                    </div>
                    <div className="text-[10px] uppercase font-bold leading-tight">
                      {hasActiveAccess ? (
                        <span className="text-emerald-700">Plus Ativo</span>
                      ) : license?.status === 'pending' ? (
                        <span className="text-amber-600">Pendente</span>
                      ) : (
                        <span className="text-slate-400">Sem Acesso</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</div>
                      <div className="mt-1.5">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          hasActiveAccess
                            ? 'bg-emerald-100 text-[#154734]'
                            : license?.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          Licença: {license?.status || 'none'}
                        </span>
                      </div>
                    </div>

                    {!hasActiveAccess && (
                      <div className="p-2 border-b border-slate-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenCheckout();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#154734] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#0f3426]"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Adquirir Acesso Plus</span>
                        </button>
                      </div>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Painel de Administração</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleNav('sandbox')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Consola de Testes Sandbox</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenDataModal();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Privacidade & RGPD</span>
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Terminar Sessão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                >
                  Entrar
                </button>
                <button
                  onClick={onOpenCheckout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#154734] hover:bg-[#0f3426] text-white transition-colors shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>Obter Plus</span>
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aplicação Android</span>
            <PWAInstallButton variant="primary" label="Instalar no Telemóvel" className="w-full sm:w-auto" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#154734] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="w-full p-2.5 rounded-xl bg-rose-50 text-rose-900 text-xs font-bold text-left flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Painel de Administração</span>
              </button>
            )}

            <button
              onClick={() => handleNav('sandbox')}
              className="w-full p-2.5 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold text-left flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-purple-600" />
              <span>Consola Sandbox de Testes</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
