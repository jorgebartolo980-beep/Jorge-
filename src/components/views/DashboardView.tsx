import React from 'react';
import { usePetCare } from '../../context/PetCareContext';
import { ACADEMY_MODULES } from '../../data/initialData';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Receipt,
  BookOpen,
  Bot,
  AlertCircle,
  Heart,
  Scale,
  Award,
  Circle,
  PawPrint,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenNewTaskModal: (defaultPetId?: string) => void;
  onOpenNewDiaryModal: (defaultPetId?: string) => void;
  onOpenNewExpenseModal: (defaultPetId?: string) => void;
  onOpenNewPetModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewTaskModal,
  onOpenNewDiaryModal,
  onOpenNewExpenseModal,
  onOpenNewPetModal,
}) => {
  const {
    pets,
    activePet,
    activePetId,
    setActivePetId,
    tasks,
    toggleTask,
    diaryEntries,
    expenses,
    completedModules,
    userProfile,
  } = usePetCare();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 19) return 'Boa tarde';
    return 'Boa noite';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks for today
  const todayTasks = tasks.filter((t) => {
    const matchesPet = !activePetId || t.petId === activePetId;
    return t.date === todayStr && matchesPet;
  });

  // Filter upcoming tasks (future date)
  const upcomingTasks = tasks
    .filter((t) => {
      const matchesPet = !activePetId || t.petId === activePetId;
      return t.date > todayStr && matchesPet && !t.completed;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  // Filter latest diary entries
  const petDiary = diaryEntries
    .filter((d) => !activePetId || d.petId === activePetId)
    .sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));

  const latestDiary = petDiary[0] || null;

  // Monthly expenses total for current month
  const currentMonthPrefix = todayStr.slice(0, 7); // YYYY-MM
  const currentMonthExpenses = expenses.filter((e) => {
    const matchesPet = !activePetId || e.petId === activePetId;
    return e.date.startsWith(currentMonthPrefix) && matchesPet;
  });

  const totalMonthEuro = currentMonthExpenses.reduce((sum, e) => sum + e.amountEuro, 0);

  // Academy progress calculation
  const totalAcademyModules = ACADEMY_MODULES.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalAcademyModules) * 100);

  if (pets.length === 0) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-[#154734] flex items-center justify-center border border-emerald-100 shadow-sm">
          <PawPrint className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800">
            Começa por adicionar o teu primeiro animal
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Para desbloquear o painel diário, agenda de rotinas, histórico de peso e despesas, adiciona o perfil do teu cão ou gato.
          </p>
        </div>
        <button
          onClick={onOpenNewPetModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white text-sm font-bold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Perfil do Meu Animal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Greeting & Active Pet Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
              {getGreeting()}, {userProfile.name}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activePet ? `Acompanhamento de ${activePet.name}` : 'Visão Geral da Família'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {activePet ? (
              <>
                {activePet.species === 'cão' ? '🐕 Cão' : activePet.species === 'gato' ? '🐈 Gato' : '🐾 Animal'}{' '}
                • {activePet.breed || 'SRD'} • {activePet.approxAge || 'Idade registada'} • {activePet.weightKg ? `${activePet.weightKg} kg` : 'Sem peso'}
              </>
            ) : (
              'A apresentar dados combinados de todos os teus animais'
            )}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenNewTaskModal(activePetId || undefined)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tarefa</span>
          </button>
          <button
            onClick={() => onOpenNewDiaryModal(activePetId || undefined)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Diário / Peso</span>
          </button>
          <button
            onClick={() => onOpenNewExpenseModal(activePetId || undefined)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Despesa (€)</span>
          </button>
        </div>
      </section>

      {/* Multi-Pet Quick Selector Strip */}
      {pets.length > 1 && (
        <section className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Animal:</span>
          {pets.map((p) => {
            const isSelected = p.id === activePetId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePetId(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-[#154734] text-white border-[#154734] shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{p.name}</span>
                <span className="text-[10px] opacity-75 capitalize">({p.species})</span>
              </button>
            );
          })}
        </section>
      )}

      {/* Main Grid: Left (Tasks + Diary) & Right (Expenses + Academy + AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Tasks */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 text-[#154734]">
                  <Calendar className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Cuidados previstos para hoje</h2>
                  <p className="text-xs text-slate-500">
                    {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#154734] hover:underline inline-flex items-center gap-1"
              >
                <span>Ver calendário</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-2 pt-1">
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      t.completed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTask(t.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          t.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 hover:border-emerald-600 text-transparent'
                        }`}
                        title={t.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>
                      <div className="truncate">
                        <span
                          className={`text-xs font-bold block truncate ${
                            t.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize">
                          {t.time ? `${t.time} • ` : ''}{t.category}
                          {t.notes ? ` • ${t.notes}` : ''}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        t.completed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-[#154734]'
                      }`}
                    >
                      {t.completed ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600/40 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Sem tarefas pendentes agendadas para hoje.</p>
                <p className="text-[11px] text-slate-400">Podes adicionar rotinas de alimentação, passeios ou medicação.</p>
                <button
                  onClick={() => onOpenNewTaskModal(activePetId || undefined)}
                  className="mt-2 text-xs font-bold text-[#154734] underline"
                >
                  + Agendar novo cuidado
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Events / Vet Checks */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Próximos eventos & vacinações</h2>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#154734] hover:underline"
              >
                Agenda completa
              </button>
            </div>

            {upcomingTasks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{new Date(t.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}</span>
                      <span className="capitalize bg-emerald-50 text-[#154734] px-2 py-0.5 rounded font-bold text-[10px]">
                        {t.category}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{t.title}</div>
                    {t.notes && <div className="text-[11px] text-slate-500 line-clamp-1">{t.notes}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Sem eventos agendados para os próximos dias.</p>
            )}
          </div>

          {/* Latest Diary Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Clock className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Último registo no diário</h2>
                  <p className="text-xs text-slate-500">Monitorização de peso, humor e atividade</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('diary')}
                className="text-xs font-bold text-[#154734] hover:underline"
              >
                Histórico completo
              </button>
            </div>

            {latestDiary ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {new Date(latestDiary.date).toLocaleDateString('pt-PT')} {latestDiary.time ? `• ${latestDiary.time}` : ''}
                  </span>
                  {latestDiary.weightKg && (
                    <span className="font-extrabold text-[#154734] bg-emerald-100/70 px-2.5 py-1 rounded-full text-xs">
                      ⚖️ {latestDiary.weightKg} kg
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {latestDiary.mood && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Disposição:</span>
                      <span className="font-semibold capitalize text-slate-800">{latestDiary.mood}</span>
                    </div>
                  )}
                  {latestDiary.exerciseMinutes !== undefined && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Atividade:</span>
                      <span className="font-semibold text-slate-800">{latestDiary.exerciseMinutes} min</span>
                    </div>
                  )}
                  {latestDiary.dietNotes && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200 sm:col-span-1 col-span-2">
                      <span className="text-[10px] text-slate-400 block">Alimentação:</span>
                      <span className="font-semibold text-slate-800 truncate block">{latestDiary.dietNotes}</span>
                    </div>
                  )}
                </div>

                {latestDiary.notes && (
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    "{latestDiary.notes}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Ainda não registaste nenhuma entrada no diário para este animal.</p>
                <button
                  onClick={() => onOpenNewDiaryModal(activePetId || undefined)}
                  className="mt-2 text-xs font-bold text-[#154734] underline"
                >
                  + Fazer primeiro registo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Expenses + Academy + AI Quick Access */}
        <div className="space-y-8">
          {/* Expenses Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Despesas do Mês
              </span>
              <button
                onClick={() => onNavigate('expenses')}
                className="text-xs font-bold text-[#154734] hover:underline"
              >
                Gerir custos
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#154734] text-white">
              <span className="text-xs text-emerald-200 font-medium">Total em {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</span>
              <div className="text-3xl font-extrabold mt-1 tracking-tight">
                {totalMonthEuro.toFixed(2)} €
              </div>
              <span className="text-[11px] text-emerald-300 mt-1 block">
                {currentMonthExpenses.length} registos neste período
              </span>
            </div>

            {currentMonthExpenses.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-none">
                <div className="truncate pr-2">
                  <div className="font-bold text-slate-800 truncate">{e.description}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{e.category}</div>
                </div>
                <span className="font-extrabold text-slate-800 shrink-0">
                  {e.amountEuro.toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          {/* Academy Progress Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#154734]" />
                <h3 className="text-sm font-bold text-slate-900">Academia de Educação</h3>
              </div>
              <span className="text-xs font-extrabold text-[#154734]">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#154734] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-500">
              Concluíste {completedCount} de {totalAcademyModules} módulos de reforço positivo e bem-estar.
            </p>

            <button
              onClick={() => onNavigate('academy')}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#154734] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Continuar Aprendizagem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick AI Assistant Card */}
          <div className="bg-gradient-to-br from-[#FAF9F5] to-emerald-50/60 rounded-3xl p-6 border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#154734]">
              <Bot className="w-5 h-5" />
              <h3 className="text-sm font-bold">Assistente PetCare AI</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dúvidas sobre o comportamento de {activePet?.name || 'teu animal'}? Coloca perguntas sobre habituação à trela, enriquecimento ou alimentação.
            </p>
            <button
              onClick={() => onNavigate('assistant')}
              className="w-full py-2.5 rounded-xl bg-[#154734] hover:bg-[#0f3426] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Conversar com a IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
