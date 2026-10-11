import React, { useState } from 'react';
import { Pet } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import {
  Plus,
  Edit2,
  Trash2,
  Heart,
  Scale,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  FileText,
  Tag,
  Check,
} from 'lucide-react';

interface PetsViewProps {
  onOpenNewPetModal: () => void;
  onEditPet: (pet: Pet) => void;
  onNavigateToCalendar: () => void;
  onNavigateToDiary: () => void;
}

export const PetsView: React.FC<PetsViewProps> = ({
  onOpenNewPetModal,
  onEditPet,
  onNavigateToCalendar,
  onNavigateToDiary,
}) => {
  const { pets, activePetId, setActivePetId, deletePet, tasks, diaryEntries } = usePetCare();
  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            A Tua Família de Quatro Patas
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Perfis dos Animais ({pets.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gere todos os animais da tua conta num único local, com dados de saúde, comportamento e historial.
          </p>
        </div>

        <button
          onClick={onOpenNewPetModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Novo Animal</span>
        </button>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => {
          const isActive = pet.id === activePetId;
          const petTasksCount = tasks.filter((t) => t.petId === pet.id && !t.completed).length;
          const petDiaryCount = diaryEntries.filter((d) => d.petId === pet.id).length;

          return (
            <div
              key={pet.id}
              className={`rounded-3xl bg-white border transition-all overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Card Header with image banner */}
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={pet.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Species Badge */}
                  <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                    {pet.species === 'cão' ? '🐕 Cão' : pet.species === 'gato' ? '🐈 Gato' : '🐾 Outro'}
                  </span>

                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Animal Ativo</span>
                    </span>
                  )}

                  {/* Name and breed on photo */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold leading-tight">{pet.name}</h3>
                    <p className="text-xs text-slate-200 truncate">
                      {pet.breed || 'Raça não especificada'} {pet.gender && pet.gender !== 'indefinido' ? `• ${pet.gender}` : ''}
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  {/* Quick stats pills */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Idade:</span>
                      <span className="font-bold text-slate-700">{pet.approxAge || (pet.birthDate ? 'Registada' : '—')}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Peso Atual:</span>
                      <span className="font-bold text-[#154734]">{pet.weightKg ? `${pet.weightKg} kg` : 'Por registar'}</span>
                    </div>
                  </div>

                  {/* Behavioral traits */}
                  {pet.traits && pet.traits.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Comportamento & Personalidade
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pet.traits.map((tr, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#154734] font-medium border border-emerald-100"
                          >
                            {tr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergies or Needs */}
                  {pet.allergies && (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60 text-xs text-rose-900">
                      <span className="font-bold block">Alergias / Sensibilidades:</span>
                      <span>{pet.allergies}</span>
                    </div>
                  )}

                  {pet.specialNeeds && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                      <span className="font-bold block">Necessidades Especiais:</span>
                      <span>{pet.specialNeeds}</span>
                    </div>
                  )}

                  {/* Microchip & Vet */}
                  {(pet.microchip || pet.vetContact) && (
                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                      {pet.microchip && (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Chip: <strong>{pet.microchip}</strong></span>
                        </div>
                      )}
                      {pet.vetContact && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{pet.vetContact}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#FAF9F5] border-t border-slate-100 flex items-center justify-between gap-2">
                {!isActive ? (
                  <button
                    onClick={() => setActivePetId(pet.id)}
                    className="text-xs font-bold text-[#154734] hover:underline"
                  >
                    Tornar Ativo
                  </button>
                ) : (
                  <span className="text-xs text-emerald-800 font-bold">Animal Selecionado</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditPet(pet)}
                    className="p-2 rounded-xl text-slate-600 hover:text-[#154734] hover:bg-slate-200/60 transition-colors"
                    title="Editar perfil"
                    aria-label="Editar perfil"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPetToDelete(pet.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar animal"
                    aria-label="Eliminar animal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Pet Deletion Modal */}
      {petToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Eliminar Perfil do Animal?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tens a certeza de que desejas eliminar este perfil? As tarefas, medições de peso e registos associados a este animal também serão removidos.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPetToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deletePet(petToDelete);
                  setPetToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Sim, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
