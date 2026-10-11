import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle2, X, ExternalLink, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'minimal' | 'banner';
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'primary',
  label = 'Instalar no Android',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running inside an installed standalone PWA, hide or show installed badge
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Aplicação Instalada
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const buttonContent = (
    <>
      <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
      <span>{installSuccess ? 'Instalação Iniciada!' : label}</span>
    </>
  );

  let buttonClasses = '';
  if (variant === 'primary') {
    buttonClasses =
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#154734] hover:bg-[#0F3426] active:scale-95 rounded-xl shadow-sm hover:shadow transition-all group';
  } else if (variant === 'outline') {
    buttonClasses =
      'inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#154734] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all group';
  } else if (variant === 'minimal') {
    buttonClasses =
      'inline-flex items-center gap-1.5 text-xs font-medium text-[#154734] hover:text-emerald-700 underline underline-offset-2';
  } else if (variant === 'banner') {
    buttonClasses =
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition-all';
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`${buttonClasses} ${className}`}
        title="Instalar PetCare 360 no seu dispositivo Android ou computador"
      >
        {buttonContent}
      </button>

      {/* Guide Modal for Android Chrome / iOS */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#154734] flex items-center justify-center text-white shadow-md">
                <Smartphone className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">
                  Instalar PetCare 360 no Android
                </h3>
                <p className="text-xs text-slate-500">
                  Progressive Web App oficial • Sem taxas de loja
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3.5 mb-4 text-xs text-emerald-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <p>
                A aplicação funciona diretamente como app nativa: ícone de alta resolução,
                arranque instantâneo, ecrã inteiro sem barra de navegador e funcionamento offline.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 mb-6">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#154734] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-900">No Google Chrome para Android:</p>
                  <p className="text-slate-600 mt-0.5">
                    Toca no menu de três pontos <strong className="text-slate-900">(⋮)</strong> no canto superior direito do navegador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#154734] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Seleciona a opção:</p>
                  <p className="text-slate-600 mt-0.5">
                    Clica em <strong className="text-[#154734]">«Instalar aplicação»</strong> ou <strong className="text-[#154734]">«Adicionar ao ecrã principal»</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-[#154734] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Confirmar instalação:</p>
                  <p className="text-slate-600 mt-0.5">
                    Toca em <strong>«Instalar»</strong>. O ícone oficial do PetCare 360 ficará disponível no teu ecrã de início e na lista de aplicações.
                  </p>
                </div>
              </div>

              {isIOS && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                  <p className="font-semibold mb-0.5">Nota para iPhone/iPad (Safari):</p>
                  <p>
                    Toca no botão <strong>Partilhar</strong> (ícone do quadrado com a seta para cima) e escolhe <strong>«Adicionar ao ecrã principal»</strong>.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#154734] text-white text-xs font-bold hover:bg-[#0F3426] transition"
              >
                Compreendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
