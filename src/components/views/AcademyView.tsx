import React, { useState } from 'react';
import { AcademyModule, Species, AcademyLevel } from '../../types';
import { ACADEMY_MODULES } from '../../data/initialData';
import { usePetCare } from '../../context/PetCareContext';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Award,
  Clock,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AcademyView: React.FC = () => {
  const {
    completedModules,
    toggleModuleCompleted,
    favoriteModules,
    toggleModuleFavorite,
  } = usePetCare();

  const [selectedSpecies, setSelectedSpecies] = useState<'todos' | 'cão' | 'gato'>('todos');
  const [selectedLevel, setSelectedLevel] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyCompleted, setOnlyCompleted] = useState(false);
  const [activeLesson, setActiveLesson] = useState<AcademyModule | null>(null);

  // Filter modules
  const filteredModules = ACADEMY_MODULES.filter((mod) => {
    if (selectedSpecies !== 'todos' && mod.species !== 'todos' && mod.species !== selectedSpecies) {
      return false;
    }
    if (selectedLevel !== 'todos' && mod.level !== selectedLevel) {
      return false;
    }
    if (onlyFavorites && !favoriteModules.includes(mod.id)) {
      return false;
    }
    if (onlyCompleted && !completedModules.includes(mod.id)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mod.title.toLowerCase().includes(q);
      const matchSummary = mod.summary.toLowerCase().includes(q);
      const matchTheme = mod.theme.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchTheme) return false;
    }
    return true;
  });

  const progressCount = completedModules.length;
  const progressPercent = Math.round((progressCount / ACADEMY_MODULES.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Progress Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Educação & Comportamento Positivo
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academia PetCare
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Aprende a comunicar com o teu cão ou gato através da ciência do reforço positivo, sem medos nem métodos aversivos.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 min-w-[260px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Progresso na Academia</span>
            </span>
            <span className="font-extrabold text-[#154734]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#154734] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block text-right">
            {progressCount} de {ACADEMY_MODULES.length} módulos concluídos
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar módulo, trela, caixa de areia, linguagem..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
            />
          </div>

          {/* Species Filter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-bold">
            <button
              onClick={() => setSelectedSpecies('todos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSpecies === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedSpecies('cão')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSpecies === 'cão' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              🐕 Cães
            </button>
            <button
              onClick={() => setSelectedSpecies('gato')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSpecies === 'gato' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              🐈 Gatos
            </button>
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="todos">Todos os Níveis</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermedio">Intermédio</option>
            <option value="avancado">Avançado</option>
          </select>

          {/* Quick Toggles */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              onlyFavorites
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Guardados ({favoriteModules.length})</span>
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => {
          const isDone = completedModules.includes(mod.id);
          const isFav = favoriteModules.includes(mod.id);

          return (
            <div
              key={mod.id}
              className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-300/80 bg-emerald-50/10 shadow-xs'
                  : 'border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {mod.species === 'cão' ? '🐕 Cão' : mod.species === 'gato' ? '🐈 Gato' : '🐾 Geral'}
                    </span>
                    <span className="text-[10px] font-semibold capitalize px-2 py-0.5 rounded-md bg-emerald-50 text-[#154734]">
                      {mod.level}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleModuleFavorite(mod.id)}
                    className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${
                      isFav ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                    title={isFav ? 'Remover dos guardados' : 'Guardar módulo'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {mod.summary}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{mod.estimatedMinutes} min</span>
                  </span>
                  <span>•</span>
                  <span>{mod.theme}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleModuleCompleted(mod.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    isDone ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                  <span>{isDone ? 'Concluído' : 'Marcar Concluído'}</span>
                </button>

                <button
                  onClick={() => setActiveLesson(mod)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>Abrir Aula</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Behavioral Evaluation Disclaimer */}
      <div className="p-4 rounded-3xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aviso Ético e Comportamental:</strong> A aprendizagem animal varia de indivíduo para indivíduo e não prometemos resultados imediatos ou infalíveis. Em situações persistentes de reatividade grave, medo paralisante, agressividade ou sofrimento emocional, recomendamos vivamente a consulta de um médico veterinário especialista em comportamento ou de um treinador certificado em métodos force-free.
        </p>
      </div>

      {/* Active Lesson Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-[#FAF9F5] border-b border-slate-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs">
                  <span className="font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#154734]">
                    {activeLesson.species === 'cão' ? '🐕 Cão' : '🐈 Gato'} • {activeLesson.theme}
                  </span>
                  <span className="text-slate-400">• {activeLesson.estimatedMinutes} minutos de leitura</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#154734] leading-tight">
                  {activeLesson.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
              {/* Objectives */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                <h4 className="font-bold text-[#154734] uppercase tracking-wider text-xs">
                  🎯 Objetivos Deste Módulo
                </h4>
                <ul className="space-y-1.5 text-slate-700">
                  {activeLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Explicação Científica & Fundamentação</h4>
                <p>{activeLesson.explanation}</p>
              </div>

              {/* Step by Step */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Passo a Passo Prático</h4>
                <div className="space-y-2">
                  {activeLesson.stepByStep.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-[#154734] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">⚠️ Erros Comuns a Evitar</h4>
                <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                  {activeLesson.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Practical Exercise Box */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2 text-amber-950">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <PlayCircle className="w-4 h-4 text-amber-700" />
                  <span>Exercício Prático: {activeLesson.practicalExercise.title}</span>
                </div>
                <p>{activeLesson.practicalExercise.instructions}</p>
                <div className="pt-1 text-xs text-amber-800 font-semibold">
                  💡 Como avaliar o sucesso: {activeLesson.practicalExercise.evaluationTip}
                </div>
              </div>

              {/* Safety tips */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Dicas de Segurança
                </h4>
                <ul className="space-y-1 text-slate-500 list-disc pl-5">
                  {activeLesson.safetyTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Sources */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold">Fontes e referências consultadas:</span>
                <p>{activeLesson.sources.join(' • ')}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#FAF9F5] border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => toggleModuleCompleted(activeLesson.id)}
                className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  completedModules.includes(activeLesson.id)
                    ? 'bg-emerald-100 text-[#154734]'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedModules.includes(activeLesson.id)
                    ? 'Módulo Concluído'
                    : 'Marcar como Concluído'}
                </span>
              </button>

              <button
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#154734] hover:bg-[#0f3426] text-white shadow-xs"
              >
                Fechar Aula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
