import React, { useState, useEffect } from 'react';
import { Pet, Species, Gender } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import { X, Sparkles, AlertCircle, Camera, Check } from 'lucide-react';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToEdit?: Pet | null;
}

const PHOTO_PRESETS: { label: string; url: string; species: Species }[] = [
  {
    label: 'Cão SRD Caramelo',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    species: 'cão',
  },
  {
    label: 'Golden / Labrador',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    species: 'cão',
  },
  {
    label: 'Cão Porte Pequeno',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    species: 'cão',
  },
  {
    label: 'Gato Europeu Tigrado',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    species: 'gato',
  },
  {
    label: 'Gato Laranja / Branco',
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    species: 'gato',
  },
  {
    label: 'Gato Preto / Bombaim',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
    species: 'gato',
  },
];

const COMMON_TRAITS = [
  'Meigo',
  'Brincalhão',
  'Calmo',
  'Sociável com cães',
  'Sociável com gatos',
  'Gosta de crianças',
  'Tímido com estranhos',
  'Sensível a ruídos/trovoadas',
  'Muito ativo',
  'Independente',
];

export const PetModal: React.FC<PetModalProps> = ({ isOpen, onClose, petToEdit }) => {
  const { addPet, updatePet } = usePetCare();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('cão');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [approxAge, setApproxAge] = useState('');
  const [gender, setGender] = useState<Gender>('indefinido');
  const [weightKg, setWeightKg] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState(PHOTO_PRESETS[0].url);
  const [customPhoto, setCustomPhoto] = useState(false);
  const [traits, setTraits] = useState<string[]>([]);
  const [newTraitInput, setNewTraitInput] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [notes, setNotes] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [vetContact, setVetContact] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name);
      setSpecies(petToEdit.species);
      setBreed(petToEdit.breed || '');
      setBirthDate(petToEdit.birthDate || '');
      setApproxAge(petToEdit.approxAge || '');
      setGender(petToEdit.gender);
      setWeightKg(petToEdit.weightKg ? petToEdit.weightKg.toString() : '');
      setArrivalDate(petToEdit.arrivalDate || '');
      setPhotoUrl(petToEdit.photoUrl || PHOTO_PRESETS[0].url);
      setTraits(petToEdit.traits || []);
      setAllergies(petToEdit.allergies || '');
      setSpecialNeeds(petToEdit.specialNeeds || '');
      setNotes(petToEdit.notes || '');
      setMicrochip(petToEdit.microchip || '');
      setVetContact(petToEdit.vetContact || '');
    } else {
      // Defaults for new pet
      setName('');
      setSpecies('cão');
      setBreed('');
      setBirthDate('');
      setApproxAge('');
      setGender('indefinido');
      setWeightKg('');
      setArrivalDate(new Date().toISOString().split('T')[0]);
      setPhotoUrl(PHOTO_PRESETS[0].url);
      setTraits(['Meigo', 'Brincalhão']);
      setAllergies('');
      setSpecialNeeds('');
      setNotes('');
      setMicrochip('');
      setVetContact('');
    }
    setErrors({});
  }, [petToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleTrait = (trait: string) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter((t) => t !== trait));
    } else {
      setTraits([...traits, trait]);
    }
  };

  const handleAddCustomTrait = () => {
    if (newTraitInput.trim() && !traits.includes(newTraitInput.trim())) {
      setTraits([...traits, newTraitInput.trim()]);
      setNewTraitInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome do animal é obrigatório.';
    }

    if (weightKg && isNaN(Number(weightKg))) {
      newErrors.weightKg = 'Insira um peso válido em kg (ex.: 12.5).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name: name.trim(),
      species,
      breed: breed.trim() || undefined,
      birthDate: birthDate || undefined,
      approxAge: approxAge.trim() || undefined,
      gender,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      arrivalDate: arrivalDate || undefined,
      photoUrl,
      traits,
      allergies: allergies.trim() || undefined,
      specialNeeds: specialNeeds.trim() || undefined,
      notes: notes.trim() || undefined,
      microchip: microchip.trim() || undefined,
      vetContact: vetContact.trim() || undefined,
    };

    if (petToEdit) {
      updatePet(petToEdit.id, payload);
    } else {
      addPet(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-[#154734]">
              {petToEdit ? `Editar Perfil de ${petToEdit.name}` : 'Adicionar Novo Animal'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Campos identificados com * são essenciais. Os restantes são opcionais para enriquecer o acompanhamento.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Photo Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Fotografia do Animal
            </label>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={photoUrl}
                alt="Pré-visualização"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-700/40 shadow-xs"
              />
              <div className="flex-1">
                <span className="text-xs text-slate-600 block mb-1">Escolha uma fotografia rápida ou insira o URL da sua imagem:</span>
                <div className="flex flex-wrap gap-2">
                  {PHOTO_PRESETS.filter(p => p.species === species || species === 'outro').slice(0, 4).map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setPhotoUrl(preset.url);
                        setCustomPhoto(false);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        photoUrl === preset.url && !customPhoto
                          ? 'border-[#154734] bg-emerald-50 text-[#154734] font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomPhoto(!customPhoto)}
                    className="text-[11px] px-2.5 py-1 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 text-slate-600"
                  >
                    Outro URL...
                  </button>
                </div>
              </div>
            </div>

            {customPhoto && (
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://exemplo.com/foto-do-animal.jpg"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            )}
          </div>

          {/* Primary Info (Row 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Animal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex.: Pipoca, Simba, Luna"
                className={`w-full p-2.5 text-sm rounded-xl border ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:ring-2 focus:ring-[#154734] outline-none`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Espécie <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['cão', 'gato', 'outro'] as Species[]).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => {
                      setSpecies(sp);
                      const matched = PHOTO_PRESETS.find((p) => p.species === sp);
                      if (matched && !customPhoto) setPhotoUrl(matched.url);
                    }}
                    className={`py-2 text-xs font-bold rounded-xl capitalize transition-all border ${
                      species === sp
                        ? 'bg-[#154734] text-white border-[#154734]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {sp === 'cão' ? '🐕 Cão' : sp === 'gato' ? '🐈 Gato' : '🐾 Outro'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Breed, Gender, Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Raça (se conhecida)
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="ex.: Sem Raça Definida (SRD)"
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sexo
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none bg-white"
              >
                <option value="indefinido">Não especificado</option>
                <option value="macho">Macho</option>
                <option value="fêmea">Fêmea</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peso atual (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="120"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="ex.: 14.2"
                className={`w-full p-2.5 text-sm rounded-xl border ${
                  errors.weightKg ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:ring-2 focus:ring-[#154734] outline-none`}
              />
              {errors.weightKg && <p className="text-xs text-rose-500 mt-1">{errors.weightKg}</p>}
            </div>
          </div>

          {/* Row 3: Birth date / Approx Age & Arrival Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ou Idade aproximada
              </label>
              <input
                type="text"
                value={approxAge}
                onChange={(e) => setApproxAge(e.target.value)}
                placeholder="ex.: 3 anos, 6 meses"
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chegada à Família / Adoção
              </label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>
          </div>

          {/* Behavioral Traits */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Características de Comportamento
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_TRAITS.map((tr) => {
                const selected = traits.includes(tr);
                return (
                  <button
                    key={tr}
                    type="button"
                    onClick={() => toggleTrait(tr)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selected
                        ? 'bg-[#154734] text-white border-[#154734] font-semibold'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {tr}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTraitInput}
                onChange={(e) => setNewTraitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTrait();
                  }
                }}
                placeholder="Adicionar traço personalizado..."
                className="flex-1 p-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTrait}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Allergies & Special Needs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alergias ou Sensibilidades Alimentares
              </label>
              <textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                rows={2}
                placeholder="ex.: Alergia a frango, dermatite atópica..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Necessidades Especiais / Rotina
              </label>
              <textarea
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                rows={2}
                placeholder="ex.: Medo de trovoadas, toma condroprotetor diário..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none resize-none"
              />
            </div>
          </div>

          {/* Microchip & Vet Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                N.º Microchip (SIAC)
              </label>
              <input
                type="text"
                value={microchip}
                onChange={(e) => setMicrochip(e.target.value)}
                placeholder="ex.: 642098100..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clínica / Veterinário Assistente
              </label>
              <input
                type="text"
                value={vetContact}
                onChange={(e) => setVetContact(e.target.value)}
                placeholder="ex.: Hospital Veterinário (+351 ...)"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações Pessoais do Tutor
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Notas gerais, preferências de brinquedos, história do resgate..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#154734] hover:bg-[#0f3426] text-white shadow-md transition-colors"
            >
              {petToEdit ? 'Guardar Alterações' : 'Criar Perfil do Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
