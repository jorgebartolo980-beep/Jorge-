import React, { useState, useEffect } from 'react';
import { DiaryEntry, PetMood } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import { X, Scale, Heart, Sparkles } from 'lucide-react';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: DiaryEntry | null;
  defaultPetId?: string;
}

const MOODS: { id: PetMood; label: string; icon: string }[] = [
  { id: 'excelente', label: 'Excelente / Radiante', icon: '🌟' },
  { id: 'alegre', label: 'Alegre / Brincalhão', icon: '🐾' },
  { id: 'calmo', label: 'Calmo / Relaxado', icon: '🍃' },
  { id: 'apatico', label: 'Apático / Mais Quieto', icon: '💤' },
  { id: 'agitado', label: 'Agitado / Ansioso', icon: '⚡' },
  { id: 'dor_desconforto', label: 'Desconforto / Dor', icon: '🩹' },
];

export const DiaryModal: React.FC<DiaryModalProps> = ({
  isOpen,
  onClose,
  entryToEdit,
  defaultPetId,
}) => {
  const { pets, activePetId, addDiaryEntry, updateDiaryEntry } = usePetCare();

  const [petId, setPetId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [mood, setMood] = useState<PetMood>('calmo');
  const [dietNotes, setDietNotes] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [hygieneNotes, setHygieneNotes] = useState('');
  const [vetObservations, setVetObservations] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (entryToEdit) {
      setPetId(entryToEdit.petId);
      setDate(entryToEdit.date);
      setTime(entryToEdit.time || '');
      setWeightKg(entryToEdit.weightKg ? entryToEdit.weightKg.toString() : '');
      setMood(entryToEdit.mood || 'calmo');
      setDietNotes(entryToEdit.dietNotes || '');
      setExerciseMinutes(entryToEdit.exerciseMinutes ? entryToEdit.exerciseMinutes.toString() : '');
      setHygieneNotes(entryToEdit.hygieneNotes || '');
      setVetObservations(entryToEdit.vetObservations || '');
      setNotes(entryToEdit.notes || '');
    } else {
      setPetId(defaultPetId || activePetId || (pets[0]?.id || ''));
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
      setWeightKg('');
      setMood('calmo');
      setDietNotes('');
      setExerciseMinutes('30');
      setHygieneNotes('');
      setVetObservations('');
      setNotes('');
    }
    setError('');
  }, [entryToEdit, isOpen, defaultPetId, activePetId, pets]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) {
      setError('Por favor seleciona um animal para este registo.');
      return;
    }
    if (weightKg && isNaN(Number(weightKg))) {
      setError('Insere um valor de peso válido (ex.: 14.2).');
      return;
    }

    const payload = {
      petId,
      date,
      time: time || undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      mood,
      dietNotes: dietNotes.trim() || undefined,
      exerciseMinutes: exerciseMinutes ? parseInt(exerciseMinutes, 10) : undefined,
      hygieneNotes: hygieneNotes.trim() || undefined,
      vetObservations: vetObservations.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (entryToEdit) {
      updateDiaryEntry(entryToEdit.id, payload);
    } else {
      addDiaryEntry(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-[#154734]">
              {entryToEdit ? 'Editar Registo no Diário' : 'Novo Registo no Diário do Animal'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanha peso, humor, apetite e bem-estar físico.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Pet & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Animal *
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
                Data do Registo *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Estado de Espírito / Disposição
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs text-left transition-all ${
                    mood === m.id
                      ? 'bg-[#154734] text-white border-[#154734] font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate">{m.label.split('/')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight & Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peso Registado (kg)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="ex.: 14.2"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Atualiza automaticamente o peso no perfil do animal.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Atividade / Passeios (Minutos)
              </label>
              <input
                type="number"
                min="0"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(e.target.value)}
                placeholder="ex.: 45"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>
          </div>

          {/* Diet & Appetite */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alimentação & Apetite
            </label>
            <input
              type="text"
              value={dietNotes}
              onChange={(e) => setDietNotes(e.target.value)}
              placeholder="ex.: Comeu com bom apetite, ração seca calibrada + 50g húmida"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
            />
          </div>

          {/* Hygiene or Vet notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações Clínicas ou Comportamentais
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="ex.: Fezes normais, dormiu muito após a brincadeira, sem sinais de dor..."
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
              {entryToEdit ? 'Guardar Registo' : 'Adicionar ao Diário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
