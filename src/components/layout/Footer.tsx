import React from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, Heart, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenPrivacyTerms: () => void;
  onOpenDataModal: () => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacyTerms,
  onOpenDataModal,
  onNavigate,
}) => {
  return (
    <footer className="bg-[#0f3426] text-emerald-100/90 pt-16 pb-12 border-t border-emerald-900/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800/50">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" lightMode={true} />
            <p className="text-sm text-emerald-200/80 leading-relaxed max-w-md">
              Cuidar melhor começa por compreender. A plataforma centralizada que combina ciência do comportamento, bem-estar animal, saúde preventiva e inteligência artificial para tutores dedicados em Portugal.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-300/80 pt-2">
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RGPD Compliant • Dados Locais Seguros</span>
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/40">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>100% Sem Métodos Aversivos</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-3">
              Módulos Centrais
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Painel Diário
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pets')}
                  className="hover:text-white transition-colors"
                >
                  Perfis dos Animais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-white transition-colors"
                >
                  Rotinas & Agenda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('diary')}
                  className="hover:text-white transition-colors"
                >
                  Diário & Peso
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('expenses')}
                  className="hover:text-white transition-colors"
                >
                  Gestão de Despesas (€)
                </button>
              </li>
            </ul>
          </div>

          {/* Education & Health */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-3">
              Conhecimento
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('academy')}
                  className="hover:text-white transition-colors"
                >
                  Academia de Educação
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('health')}
                  className="hover:text-white transition-colors"
                >
                  Centro de Saúde & Prevenção
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="hover:text-white transition-colors"
                >
                  Assistente PetCare AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('adoption')}
                  className="hover:text-white transition-colors"
                >
                  Adoção Responsável
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plans')}
                  className="hover:text-white transition-colors"
                >
                  Planos & Subscrições
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('publish')}
                  className="text-emerald-300 font-bold hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Instalar App Android (PWA)</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-700/80 rounded-full text-white">Grátis</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-3">
              Contactos & Apoio
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>contacto@petcare360.pt</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Lisboa & Porto, Portugal</span>
              </li>
              <li className="pt-2">
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-200 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1">
                    <Phone className="w-3 h-3 text-rose-400" />
                    <span>Urgências Veterinárias</span>
                  </div>
                  <p>Em caso de risco de vida, dirija-se de imediato ao Hospital Veterinário 24h mais próximo.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer on Veterinary Boundary */}
        <div className="my-8 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 text-xs text-emerald-300/90 leading-relaxed">
          <p className="font-bold text-emerald-200 mb-1">
            ⚠️ AVISO IMPORTANTE SOBRE CUIDADOS CLÍNICOS E VETERINÁRIOS:
          </p>
          <p>
            O PetCare 360 é uma plataforma informativa e educativa concebida para auxiliar os tutores na organização do dia a dia, no enriquecimento ambiental e na promoção do bem-estar dos animais de companhia. Os conteúdos e as respostas do assistente inteligente não constituem, em caso algum, diagnóstico médico-veterinário, prescrição terapêutica ou dosagem farmacológica, nem substituem a avaliação clínica individualizada realizada por um médico veterinário legalmente inscrito na Ordem dos Médicos Veterinários. Em situações de sintomatologia aguda, dor ou emergência, consulte imediatamente um profissional presencialmente.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60 pt-4">
          <p>© {new Date().getFullYear()} PetCare 360. Todos os direitos reservados. Feito com carinho para os animais em Portugal.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacyTerms}
              className="hover:text-white transition-colors underline"
            >
              Política de Privacidade & Termos
            </button>
            <span>•</span>
            <button
              onClick={onOpenDataModal}
              className="hover:text-white transition-colors underline"
            >
              Exportar / Eliminar Meus Dados (RGPD)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
