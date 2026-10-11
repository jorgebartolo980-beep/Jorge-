import React, { useState } from 'react';
import { usePetCare } from '../../context/PetCareContext';
import { ACADEMY_MODULES, HEALTH_ARTICLES } from '../../data/initialData';
import {
  Sparkles,
  ArrowRight,
  Plus,
  ShieldCheck,
  Heart,
  Bot,
  Calendar,
  BookOpen,
  Receipt,
  HeartPulse,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Award,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenNewPetModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenNewPetModal }) => {
  const { pets, activePet } = usePetCare();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O PetCare 360 substitui uma consulta veterinária?',
      a: 'Não. O PetCare 360 tem uma finalidade estritamente educativa, preventiva e de apoio à rotina diária do tutor. Nunca prescrevemos medicamentos, doses ou fazemos diagnósticos clínicos. Em caso de sintomas persistentes, dor ou emergências, encaminhamos expressamente para um médico veterinário assistente ou hospital 24h.',
    },
    {
      q: 'Como funciona o Assistente de Inteligência Artificial?',
      a: 'O nosso assistente utiliza a tecnologia avançada do Google Gemini (3.8 Flash), configurado com diretrizes rigorosas em português de Portugal. Ele tem em consideração o contexto biológico do teu animal (espécie, idade aproximada, peso, alergias declaradas) para sugerir enriquecimento ambiental, rotinas e boas práticas baseadas na ciência do reforço positivo.',
    },
    {
      q: 'Posso registar vários animais na mesma conta?',
      a: 'Sim, absolutamente! Podes adicionar cães, gatos ou outros animais de estimação, alternando instantaneamente entre os seus perfis no topo da aplicação. Cada animal tem a sua própria agenda de cuidados, diário de peso e histórico de despesas.',
    },
    {
      q: 'Onde ficam guardados os meus dados pessoais e dos meus animais?',
      a: 'No PetCare 360 cumprimos com rigor o RGPD. Os teus dados são armazenados localmente e com total privacidade no teu navegador. Não vendemos dados nem recolhemos dados sensíveis de localização. Podes exportar todos os registos em formato JSON ou eliminá-los a qualquer momento.',
    },
    {
      q: 'O que é a regra dos 3-3-3 na adoção responsável?',
      a: 'É uma diretriz comportamental que resume as fases de adaptação de um animal resgatado: 3 dias para descompressão e saída do choque inicial, 3 semanas para aprender as rotinas da casa e 3 meses para se sentir totalmente seguro e integrado na família.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#154734] via-[#0f3426] to-[#1b4332] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-emerald-800/40">
        {/* Subtle decorative circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plataforma Inteligente de Bem-Estar Animal • Portugal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Cuidar melhor começa por <span className="text-[#84a98c]">compreender</span>.
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 font-normal leading-relaxed max-w-2xl">
            Tudo o que precisas para acompanhar o bem-estar do teu animal, num só lugar. Saúde preventiva, educação com reforço positivo, rotinas diárias e assistência com inteligência artificial em português de Portugal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenNewPetModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#154734] hover:bg-emerald-50 text-sm font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-[#154734]" />
              <span>Adicionar o meu animal</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/80 text-white text-sm font-bold border border-emerald-600/40 shadow-sm transition-all"
            >
              <span>Explorar a plataforma</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Demo status bar */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 border-t border-emerald-800/60">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{pets.length} animais já registados na demonstração (ex: Pipoca, Simba, Luna)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Experiência interativa completa sem necessidade de registo prévio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Ecossistema Completo
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tudo o que precisas para uma tutoria responsável
          </h2>
          <p className="text-sm text-slate-600">
            Ferramentas desenhadas em estreita colaboração com especialistas em comportamento e bem-estar animal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'pets',
              title: 'Perfis Individuais dos Animais',
              desc: 'Gere cães, gatos e outros animais na mesma conta. Registo de chip, peso, alergias e notas de comportamento.',
              icon: Heart,
              color: 'emerald',
            },
            {
              id: 'calendar',
              title: 'Agenda de Rotinas & Cuidados',
              desc: 'Planeia passeios, medicação, desparasitações e consultas veterinárias com repetição e marcação direta.',
              icon: Calendar,
              color: 'teal',
            },
            {
              id: 'diary',
              title: 'Diário de Saúde & Evolução de Peso',
              desc: 'Regista apetite, disposição, atividade física e visualiza a curva ponderal com gráficos claros.',
              icon: Clock,
              color: 'emerald',
            },
            {
              id: 'academy',
              title: 'Academia de Educação Animal',
              desc: 'Módulos práticos de reforço positivo, habituação à trela, caixas de areia e linguagem corporal sem aversivos.',
              icon: BookOpen,
              color: 'green',
            },
            {
              id: 'health',
              title: 'Centro de Saúde & Prevenção',
              desc: 'Informação veterinária fundamentada, sinais vitais de alerta e protocolo rápido para situações de urgência.',
              icon: HeartPulse,
              color: 'rose',
            },
            {
              id: 'assistant',
              title: 'Assistente PetCare AI (Gemini)',
              desc: 'Dúvidas sobre comportamento e rotinas respondidas com contexto personalizado em português de Portugal.',
              icon: Bot,
              color: 'purple',
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => onNavigate(f.id)}
                className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-600/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#154734] flex items-center justify-center group-hover:bg-[#154734] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#154734] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#154734]">
                  <span>Aceder ao módulo</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Animal Education Spotlight */}
      <section className="bg-gradient-to-r from-emerald-950 via-[#154734] to-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Academia de Educação
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Educação positiva fundamentada na ciência.
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              O bem-estar animal assenta na comunicação clara e no respeito pelas necessidades biológicas de cada espécie. Os nossos módulos abrangem desde a chegada do cachorro ou gatinho à prevenção de problemas comportamentais em adultos e seniores.
            </p>
            <div className="space-y-2.5 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instruções passo a passo com exercícios práticos aplicáveis em casa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Identificação de erros comuns e prevenção de situações de medo ou frustração</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Acompanhamento de progresso e certificação pessoal de conclusão</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('academy')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#154734] font-bold text-xs hover:bg-emerald-50 transition-colors"
              >
                <span>Explorar os {ACADEMY_MODULES.length} Módulos da Academia</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="space-y-3">
            {ACADEMY_MODULES.slice(0, 3).map((mod) => (
              <div
                key={mod.id}
                onClick={() => onNavigate('academy')}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-xs transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
                  <span className="capitalize">{mod.species === 'cão' ? '🐕 Cães' : '🐈 Gatos'} • {mod.theme}</span>
                  <span>{mod.estimatedMinutes} min</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{mod.title}</h4>
                <p className="text-xs text-emerald-100/80 line-clamp-2">{mod.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health & Prevention Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
              Medicina Preventiva & Rigor
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Prevenir é o melhor ato de amor
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Conteúdos fundamentados nas diretrizes globais da WSAVA, ESCCAP e Ordem dos Médicos Veterinários.
            </p>
          </div>
          <button
            onClick={() => onNavigate('health')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#154734] hover:underline shrink-0"
          >
            <span>Ver biblioteca completa de saúde</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HEALTH_ARTICLES.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('health')}
              className={`p-6 rounded-3xl bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                art.isEmergencyAlert
                  ? 'border-rose-300 bg-rose-50/20 shadow-xs hover:border-rose-500'
                  : 'border-slate-200/80 hover:border-emerald-500/40 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      art.isEmergencyAlert
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-50 text-[#154734]'
                    }`}
                  >
                    {art.isEmergencyAlert ? 'Urgência Vital' : 'Prevenção'}
                  </span>
                  <span className="text-[11px] text-slate-400">Revisto em {art.updateDate}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{art.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3">{art.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#154734]">
                <span>Ler recomendações</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Preview Showcase */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 sm:p-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#154734] text-white text-xs font-bold">
            <Bot className="w-3.5 h-3.5" />
            <span>Assistente PetCare AI • Powered by Gemini 3.8</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Respostas seguras com o contexto do teu companheiro
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Testa perguntas sobre comportamento, preparação para consultas e enriquecimento ambiental. O assistente adapta-se à espécie e idade do animal ativo.
          </p>

          {/* Quick Prompts to Launch */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              'Como habituar o meu cão à trela sem puxar?',
              'Como preparar a casa para receber um gato?',
              'Que informações devo levar à consulta veterinária?',
              'Como posso enriquecer o ambiente do meu animal?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('assistant')}
                className="text-xs bg-white hover:bg-emerald-100/70 text-slate-700 hover:text-[#154734] px-3.5 py-2 rounded-xl border border-emerald-200/60 shadow-2xs transition-all font-medium text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('assistant')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Abrir Assistente Inteligente</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Dúvidas Comuns
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-slate-800 hover:text-[#154734] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#154734] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
