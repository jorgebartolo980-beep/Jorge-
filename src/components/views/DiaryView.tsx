import React, { useState } from 'react';
import { DiaryEntry } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import {
  Clock,
  Plus,
  Scale,
  Edit2,
  Trash2,
  Heart,
  Calendar,
  Activity,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';

interface DiaryViewProps {
  onOpenNewDiaryModal: (defaultPetId?: string) => void;
  onEditDiaryEntry: (entry: DiaryEntry) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  onOpenNewDiaryModal,
  onEditDiaryEntry,
}) => {
  const { pets, activePetId, setActivePetId, diaryEntries, deleteDiaryEntry } = usePetCare();
  const [selectedPetId, setSelectedPetId] = useState<string>(activePetId || (pets[0]?.id || 'all'));

  const filteredEntries = diaryEntries
    .filter((e) => selectedPetId === 'all' || e.petId === selectedPetId)
    .sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));

  // Weight entries sorted chronologically for graph
  const weightHistory = diaryEntries
    .filter((e) => e.weightKg !== undefined && (selectedPetId === 'all' || e.petId === selectedPetId))
    .sort((a, b) => a.date.localeCompare(b.date));

  const latestWeight = weightHistory[weightHistory.length - 1]?.weightKg;
  const previousWeight = weightHistory[weightHistory.length - 2]?.weightKg;

  let weightTrend: 'stable' | 'up' | 'down' = 'stable';
  if (latestWeight && previousWeight) {
    if (latestWeight > previousWeight + 0.1) weightTrend = 'up';
    else if (latestWeight < previousWeight - 0.1) weightTrend = 'down';
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Monitorização Diária & Ponderal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diário do Animal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Regista peso, variações de apetite, humor, higiene e atividade física para partilhar com o veterinário.
          </p>
        </div>

        <button
          onClick={() => onOpenNewDiaryModal(selectedPetId !== 'all' ? selectedPetId : undefined)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Registo no Diário</span>
        </button>
      </div>

      {/* Pet Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Filtrar por animal:</span>
        <button
          onClick={() => setSelectedPetId('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
            selectedPetId === 'all'
              ? 'bg-[#154734] text-white border-[#154734]'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          Todos os Animais
        </button>
        {pets.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPetId(p.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
              selectedPetId === p.id
                ? 'bg-[#154734] text-white border-[#154734]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <img src={p.photoUrl} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Weight History Graphic & Insights (if at least 2 entries) */}
      {weightHistory.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-50 text-[#154734]">
                <Scale className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Evolução do Peso Corporal (kg)</h3>
                <p className="text-xs text-slate-500">Histórico de pesagens registadas pelo tutor</p>
              </div>
            </div>

            {latestWeight && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-lg font-extrabold text-[#154734]">{latestWeight} kg</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {weightTrend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-rose-500" />}
                  {weightTrend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-blue-500" />}
                  {weightTrend === 'stable' && <Minus className="w-3.5 h-3.5 text-emerald-600" />}
                  <span className="capitalize">{weightTrend === 'stable' ? 'Estável' : weightTrend === 'up' ? 'Aumento' : 'Redução'}</span>
                </span>
              </div>
            )}
          </div>

          {/* Simple Visual SVG Graph */}
          {weightHistory.length >= 2 ? (
            <div className="pt-4">
              <div className="h-44 w-full flex items-end gap-3 sm:gap-6 border-b border-slate-200 pb-2 px-2">
                {weightHistory.map((pt, idx) => {
                  const maxW = Math.max(...weightHistory.map((w) => w.weightKg || 0));
                  const minW = Math.min(...weightHistory.map((w) => w.weightKg || 0)) * 0.85;
                  const ratio = ((pt.weightKg || 0) - minW) / (maxW - minW || 1);
                  const heightPercent = Math.max(20, Math.min(100, ratio * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-[#154734]">
                        {pt.weightKg}kg
                      </span>
                      <div
                        className="w-full max-w-[40px] bg-emerald-600/80 group-hover:bg-[#154734] rounded-t-xl transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-slate-400 truncate max-w-[60px]">
                        {new Date(pt.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Regista pelo menos mais uma pesagem para visualizar o gráfico de tendência comparativa.
            </p>
          )}

          {/* Medical disclaimer on weight variation */}
          <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Nota Clínica Preventiva:</strong> O gráfico apresenta dados informativos registados pelo tutor e não constitui diagnóstico de sobrepeso ou perda de massa muscular. Variações superiores a 5-10% do peso corporal em períodos curtos devem ser avaliadas presencialmente pelo médico veterinário assistente.
            </p>
          </div>
        </div>
      )}

      {/* Diary Timeline Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Histórico de Registos ({filteredEntries.length})</h3>

        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const pet = pets.find((p) => p.id === entry.petId);

              return (
                <div
                  key={entry.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all space-y-3"
                >
                  {/* Top Bar: Date, Pet, Weight */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-sm text-slate-800">
                        {new Date(entry.date).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      {entry.time && (
                        <span className="text-xs text-slate-400">({entry.time})</span>
                      )}

                      {pet && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#154734] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <img src={pet.photoUrl} alt={pet.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          <span>{pet.name}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {entry.weightKg && (
                        <span className="font-extrabold text-xs text-[#154734] bg-emerald-100/70 px-2.5 py-1 rounded-full">
                          ⚖️ {entry.weightKg} kg
                        </span>
                      )}

                      <button
                        onClick={() => onEditDiaryEntry(entry)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Editar registo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDiaryEntry(entry.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Eliminar registo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {entry.mood && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Disposição:</span>
                        <span className="font-bold text-slate-800 capitalize">{entry.mood}</span>
                      </div>
                    )}

                    {entry.exerciseMinutes !== undefined && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Atividade / Passeios:</span>
                        <span className="font-bold text-slate-800">{entry.exerciseMinutes} min</span>
                      </div>
                    )}

                    {entry.dietNotes && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2 col-span-2">
                        <span className="text-[10px] text-slate-400 block">Alimentação & Apetite:</span>
                        <span className="font-bold text-slate-800 truncate block">{entry.dietNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Free notes */}
                  {entry.notes && (
                    <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                      "{entry.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">Ainda não existem registos no diário</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Regista o peso atual, o nível de energia e observações da rotina para construir um histórico precioso.
            </p>
            <button
              onClick={() => onOpenNewDiaryModal(selectedPetId !== 'all' ? selectedPetId : undefined)}
              className="mt-2 text-xs font-bold text-[#154734] underline"
            >
              + Criar Primeiro Registo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
