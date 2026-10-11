import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, Recurrence } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import { X, Calendar, Clock, PawPrint } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultDate?: string;
  defaultPetId?: string;
  defaultCategory?: TaskCategory;
  defaultTitle?: string;
}

const CATEGORIES: { id: TaskCategory; label: string; icon: string }[] = [
  { id: 'alimentacao', label: 'Alimentação', icon: '🍲' },
  { id: 'passeio', label: 'Passeio', icon: '🦮' },
  { id: 'higiene', label: 'Higiene & Escovagem', icon: '🛁' },
  { id: 'medicacao', label: 'Medicação Prescrita', icon: '💊' },
  { id: 'desparasitacao', label: 'Desparasitação', icon: '🛡️' },
  { id: 'vacinacao', label: 'Vacinação', icon: '💉' },
  { id: 'veterinario', label: 'Consulta Veterinária', icon: '🩺' },
  { id: 'treino', label: 'Treino & Enriquecimento', icon: '🎾' },
  { id: 'outro', label: 'Outro Cuidado', icon: '📝' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultDate,
  defaultPetId,
  defaultCategory,
  defaultTitle,
}) => {
  const { pets, activePetId, addTask, updateTask } = usePetCare();

  const [title, setTitle] = useState('');
  const [petId, setPetId] = useState('');
  const [category, setCategory] = useState<TaskCategory>('passeio');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [recurrence, setRecurrence] = useState<Recurrence>('nenhuma');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPetId(taskToEdit.petId);
      setCategory(taskToEdit.category);
      setDate(taskToEdit.date);
      setTime(taskToEdit.time || '');
      setRecurrence(taskToEdit.recurrence);
      setNotes(taskToEdit.notes || '');
    } else {
      setTitle(defaultTitle || '');
      setPetId(defaultPetId || activePetId || (pets[0]?.id || ''));
      setCategory(defaultCategory || 'passeio');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      setTime('09:00');
      setRecurrence('nenhuma');
      setNotes('');
    }
    setError('');
  }, [taskToEdit, isOpen, defaultDate, defaultPetId, defaultCategory, defaultTitle, activePetId, pets]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título do cuidado é obrigatório.');
      return;
    }
    if (!petId) {
      setError('Por favor seleciona um animal para esta tarefa.');
      return;
    }

    const payload = {
      title: title.trim(),
      petId,
      category,
      date,
      time: time || undefined,
      recurrence,
      notes: notes.trim() || undefined,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, payload);
    } else {
      addTask(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-[#154734]">
              {taskToEdit ? 'Editar Cuidado / Tarefa' : 'Novo Cuidado na Agenda'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize rotinas diárias, alimentação, passeios e registos prescritos pelo veterinário.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título da Tarefa ou Cuidado *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex.: Passeio matinal, Desparasitante prescrito, Limpar caixa"
              className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
            />
          </div>

          {/* Pet & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Animal Associado *
              </label>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none bg-white font-medium"
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoria do Cuidado
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none bg-white font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data do Cuidado *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Repetição / Frequência
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'nenhuma', label: 'Única' },
                { id: 'diaria', label: 'Diária' },
                { id: 'semanal', label: 'Semanal' },
                { id: 'mensal', label: 'Mensal' },
              ].map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setRecurrence(rec.id as Recurrence)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    recurrence === rec.id
                      ? 'bg-[#154734] text-white border-[#154734]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas ou Instruções (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="ex.: Dose recomendada pelo veterinário com a refeição; deixar cheirar 15 min..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#154734] hover:bg-[#0f3426] text-white shadow-md transition-colors"
            >
              {taskToEdit ? 'Guardar Alterações' : 'Adicionar à Agenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
