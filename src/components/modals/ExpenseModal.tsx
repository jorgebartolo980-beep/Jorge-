import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import { X, Receipt, Euro } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
  defaultPetId?: string;
}

const CATEGORIES: { id: ExpenseCategory; label: string; icon: string }[] = [
  { id: 'alimentacao', label: 'Alimentação & Snacks', icon: '🍲' },
  { id: 'veterinario', label: 'Consultas Veterinárias', icon: '🩺' },
  { id: 'medicacao', label: 'Medicamentos & Desparasitantes', icon: '💊' },
  { id: 'higiene', label: 'Higiene & Banhos / Areia', icon: '🛁' },
  { id: 'acessorios', label: 'Acessórios & Brinquedos', icon: '🧸' },
  { id: 'treino', label: 'Treino & Comportamento', icon: '🎓' },
  { id: 'outros', label: 'Outros Custos', icon: '🧾' },
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
  defaultPetId,
}) => {
  const { pets, activePetId, addExpense, updateExpense } = usePetCare();

  const [description, setDescription] = useState('');
  const [amountEuro, setAmountEuro] = useState('');
  const [petId, setPetId] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('alimentacao');
  const [date, setDate] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setDescription(expenseToEdit.description);
      setAmountEuro(expenseToEdit.amountEuro.toString());
      setPetId(expenseToEdit.petId);
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
      setReceiptNotes(expenseToEdit.receiptNotes || '');
    } else {
      setDescription('');
      setAmountEuro('');
      setPetId(defaultPetId || activePetId || (pets[0]?.id || ''));
      setCategory('alimentacao');
      setDate(new Date().toISOString().split('T')[0]);
      setReceiptNotes('');
    }
    setError('');
  }, [expenseToEdit, isOpen, defaultPetId, activePetId, pets]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Por favor indica a descrição da despesa.');
      return;
    }
    if (!amountEuro || isNaN(Number(amountEuro)) || Number(amountEuro) <= 0) {
      setError('Por favor introduz um valor numérico válido em euros (€).');
      return;
    }
    if (!petId) {
      setError('Por favor seleciona o animal associado.');
      return;
    }

    const payload = {
      description: description.trim(),
      amountEuro: parseFloat(parseFloat(amountEuro).toFixed(2)),
      petId,
      category,
      date,
      receiptNotes: receiptNotes.trim() || undefined,
    };

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, payload);
    } else {
      addExpense(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-[#154734]">
              {expenseToEdit ? 'Editar Registo de Despesa' : 'Registar Nova Despesa (€)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanha o investimento real no bem-estar e saúde do teu animal.
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descrição do Custo *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex.: Saco ração 12kg, Consulta vacinação, Desparasitante..."
              className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
            />
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Valor em Euros (€) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amountEuro}
                  onChange={(e) => setAmountEuro(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2.5 pr-8 text-sm font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
                />
                <span className="absolute right-3 top-2.5 font-bold text-slate-400">€</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
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
                Data do Pagamento *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
              />
            </div>
          </div>

          {/* Receipt Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas do Recibo / Fatura (Opcional)
            </label>
            <input
              type="text"
              value={receiptNotes}
              onChange={(e) => setReceiptNotes(e.target.value)}
              placeholder="ex.: N.º Fatura FT2025/12, Loja PetShop, Farmácia Veterinária..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none"
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
              {expenseToEdit ? 'Guardar Alterações' : 'Registar Despesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
