import React, { useState } from 'react';
import { HealthArticle, TaskCategory } from '../../types';
import { HEALTH_ARTICLES } from '../../data/initialData';
import { usePetCare } from '../../context/PetCareContext';
import {
  HeartPulse,
  AlertTriangle,
  Bookmark,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Search,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  PhoneCall,
  X,
  Plus,
} from 'lucide-react';

interface HealthViewProps {
  onScheduleCare: (title: string, category: TaskCategory) => void;
}

export const HealthView: React.FC<HealthViewProps> = ({ onScheduleCare }) => {
  const { favoriteArticles, toggleArticleFavorite } = usePetCare();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<HealthArticle | null>(null);

  const categories = [
    { id: 'todos', label: 'Todas as Áreas' },
    { id: 'emergencias', label: '🚨 Emergências Vitais' },
    { id: 'desparasitacao', label: 'Desparasitação' },
    { id: 'saude_oral', label: 'Saúde Oral' },
    { id: 'peso_atividade', label: 'Peso & Condição' },
    { id: 'seniores', label: 'Animais Idosos' },
    { id: 'seguranca', label: 'Segurança em Casa' },
  ];

  const filteredArticles = HEALTH_ARTICLES.filter((art) => {
    if (selectedCategory !== 'todos' && art.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchContent = art.content.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchContent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Prevenção & Cuidados Clínicos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Centro de Saúde & Prevenção
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Informação veterinária fundamentada para apoiar decisões preventivas informadas em parceria com o teu médico veterinário.
          </p>
        </div>

        {/* Emergency Alert Hotlink */}
        <button
          onClick={() => {
            const emergencyArt = HEALTH_ARTICLES.find((a) => a.isEmergencyAlert);
            if (emergencyArt) setActiveArticle(emergencyArt);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold shadow-md transition-all shrink-0 animate-pulse"
        >
          <AlertTriangle className="w-4 h-4 text-rose-200" />
          <span>Protocolo de Emergências & Sinais Graves</span>
        </button>
      </div>

      {/* Prominent Red Banner: Urgências Imediatas */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-red-950 text-white border border-rose-800 shadow-md space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-rose-800 text-white">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-extrabold tracking-wide uppercase text-rose-100">
              Sinais Clínicos que Exigem Transporte Imediato a Hospital 24h
            </h3>
            <p className="text-xs text-rose-200">
              Não atrase o socorro nem tente mezinhas caseiras. Cada minuto pode ser decisivo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-rose-100">
          <div className="p-3 rounded-2xl bg-rose-900/60 border border-rose-700/60">
            <strong className="block text-white mb-0.5">Respiração Comprometida:</strong>
            Respiração de boca aberta em gatos, esforço abdominal agudo, gengivas azuladas ou brancas.
          </div>
          <div className="p-3 rounded-2xl bg-rose-900/60 border border-rose-700/60">
            <strong className="block text-white mb-0.5">Suspeita de Envenenamento:</strong>
            Ingestão de lírios (gatos), chocolate preto, raticidas, paracetamol ou químicos industriais.
          </div>
          <div className="p-3 rounded-2xl bg-rose-900/60 border border-rose-700/60">
            <strong className="block text-white mb-0.5">Torção Gástrica (Cães):</strong>
            Tentativa contínua de vomitar sem sair nada, abdómen inchado e rígido como um tambor.
          </div>
          <div className="p-3 rounded-2xl bg-rose-900/60 border border-rose-700/60">
            <strong className="block text-white mb-0.5">Obstrução Urinária:</strong>
            Gato a miar de dor forçando na caixa sem urinar, ou convulsões repetidas prolongadas.
          </div>
        </div>

        <div className="text-[11px] text-rose-300 flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-rose-800/60">
          <span>❌ NUNCA induzas o vómito sem ordem explícita veterinária. NUNCA administres paracetamol humano (fatal).</span>
          <span className="font-bold text-white flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
            Ligue para o Hospital Veterinário 24h enquanto se desloca
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por desparasitação, dentes, plantas tóxicas, seniores..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedCategory === c.id
                  ? 'bg-[#154734] text-white border-[#154734] shadow-2xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => {
          const isFav = favoriteArticles.includes(art.id);

          return (
            <div
              key={art.id}
              className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
                art.isEmergencyAlert
                  ? 'border-rose-300 bg-rose-50/20 shadow-xs hover:border-rose-500'
                  : 'border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      art.isEmergencyAlert
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-50 text-[#154734]'
                    }`}
                  >
                    {art.isEmergencyAlert ? '🚨 Urgência' : 'Saúde Preventiva'}
                  </span>

                  <button
                    onClick={() => toggleArticleFavorite(art.id)}
                    className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${
                      isFav ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                    title={isFav ? 'Remover dos favoritos' : 'Guardar artigo'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Revisto com base em directrizes científicas ({art.updateDate})
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {art.canScheduleAction ? (
                  <button
                    onClick={() => onScheduleCare(art.canScheduleAction!.suggestedTaskTitle, art.canScheduleAction!.category)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar Cuidado</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">Guia Informativo</span>
                )}

                <button
                  onClick={() => setActiveArticle(art)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>Ler Guia</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div
              className={`p-6 border-b flex items-start justify-between gap-4 ${
                activeArticle.isEmergencyAlert
                  ? 'bg-rose-900 text-white border-rose-800'
                  : 'bg-[#FAF9F5] border-slate-200 text-[#154734]'
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-80">
                  {activeArticle.isEmergencyAlert ? 'Protocolo de Emergência Veterinária' : 'Centro de Saúde Preventiva'}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-xl hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
              {/* Educational Disclaimer Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Aviso de Âmbito Educativo:</span>
                Este conteúdo destina-se a orientar o tutor sobre melhores práticas e prevenção. Não substitui uma consulta clínica presencial nem constitui prescrição de fármacos.
              </div>

              {/* Full Content */}
              <div className="whitespace-pre-line text-slate-800 leading-relaxed font-normal">
                {activeArticle.content}
              </div>

              {/* Key Takeaways */}
              {activeArticle.keyPoints && activeArticle.keyPoints.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                  <h4 className="font-bold text-[#154734] uppercase tracking-wider text-xs">
                    Pontos Fundamentais a Reter
                  </h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {activeArticle.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold">Fontes e referências veterinárias consultadas:</span>
                <p>{activeArticle.sources.join(' • ')}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#FAF9F5] border-t border-slate-200 flex items-center justify-between">
              {activeArticle.canScheduleAction ? (
                <button
                  onClick={() => {
                    const action = activeArticle.canScheduleAction!;
                    setActiveArticle(null);
                    onScheduleCare(action.suggestedTaskTitle, action.category);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-[#154734] text-white hover:bg-[#0f3426] shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registar na Agenda de Cuidados</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400">Leitura concluída</span>
              )}

              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
