import React, { useState } from 'react';
import { Task, TaskCategory } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Filter,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PawPrint,
} from 'lucide-react';

interface CalendarViewProps {
  onOpenNewTaskModal: (defaultPetId?: string, defaultCategory?: TaskCategory) => void;
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenNewTaskModal,
  onEditTask,
}) => {
  const { pets, activePetId, tasks, toggleTask, deleteTask } = usePetCare();

  const [selectedPetFilter, setSelectedPetFilter] = useState<string>(activePetId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    if (selectedPetFilter !== 'all' && task.petId !== selectedPetFilter) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (statusFilter === 'pending' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;
    if (timeFilter === 'today' && task.date !== todayStr) return false;
    if (timeFilter === 'week' && (task.date < todayStr || task.date > nextWeekStr)) return false;
    return true;
  }).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Rotinas & Saúde Preventiva
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Calendário & Cuidados
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Agenda passeios diários, horários de alimentação, desparasitações e consultas veterinárias.
          </p>
        </div>

        <button
          onClick={() => onOpenNewTaskModal(selectedPetFilter !== 'all' ? selectedPetFilter : undefined)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Cuidado</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe quick buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-bold">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos os dias
            </button>
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'today' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Próximos 7 dias
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluídas
            </button>
          </div>

          {/* Pet Dropdown Filter */}
          <select
            value={selectedPetFilter}
            onChange={(e) => setSelectedPetFilter(e.target.value)}
            className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Todos os Animais</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Todas as Categorias</option>
            <option value="alimentacao">Alimentação</option>
            <option value="passeio">Passeio</option>
            <option value="higiene">Higiene</option>
            <option value="medicacao">Medicação</option>
            <option value="desparasitacao">Desparasitação</option>
            <option value="vacinacao">Vacinação</option>
            <option value="veterinario">Veterinário</option>
            <option value="treino">Treino</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => {
            const pet = pets.find((p) => p.id === t.petId);
            const isToday = t.date === todayStr;
            const isPast = t.date < todayStr && !t.completed;

            return (
              <div
                key={t.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  t.completed
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                    : isPast
                    ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                {/* Left info & checkbox */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      t.completed
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 hover:border-emerald-600 text-transparent'
                    }`}
                    title={t.completed ? 'Reabrir cuidado' : 'Marcar como concluído'}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold ${
                          t.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {t.title}
                      </span>

                      {pet && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#154734] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <img
                            src={pet.photoUrl}
                            alt={pet.name}
                            className="w-3.5 h-3.5 rounded-full object-cover"
                          />
                          <span>{pet.name}</span>
                        </span>
                      )}

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize">
                        {t.category}
                      </span>

                      {t.recurrence !== 'nenhuma' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold capitalize">
                          ↻ {t.recurrence}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className={isToday ? 'font-bold text-[#154734]' : ''}>
                          {isToday ? 'Hoje' : new Date(t.date).toLocaleDateString('pt-PT')}
                        </span>
                      </span>

                      {t.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.time}</span>
                        </span>
                      )}

                      {t.notes && <span className="text-slate-400 truncate max-w-xs">"{t.notes}"</span>}
                    </div>
                  </div>
                </div>

                {/* Right action icons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onEditTask(t)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Editar cuidado"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar da agenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Nenhum cuidado encontrado com os filtros selecionados</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Experimenta alterar os filtros de data ou adiciona uma nova tarefa para o teu animal.
            </p>
            <button
              onClick={() => onOpenNewTaskModal(selectedPetFilter !== 'all' ? selectedPetFilter : undefined)}
              className="mt-2 text-xs font-bold text-[#154734] underline"
            >
              + Adicionar Cuidado Agora
            </button>
          </div>
        )}
      </div>

      {/* Reminder notification disclosure */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          💡 <strong>Lembretes na Aplicação:</strong> Os cuidados diários surgem destacados no teu Painel.
        </span>
        <span className="text-[11px] text-slate-400">Notificações locais seguras</span>
      </div>
    </div>
  );
};
