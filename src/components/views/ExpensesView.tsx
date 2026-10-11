import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import { usePetCare } from '../../context/PetCareContext';
import {
  Receipt,
  Plus,
  Euro,
  Edit2,
  Trash2,
  TrendingUp,
  PieChart,
  Calendar,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

interface ExpensesViewProps {
  onOpenNewExpenseModal: (defaultPetId?: string) => void;
  onEditExpense: (expense: Expense) => void;
}

const CATEGORY_NAMES: { [key in ExpenseCategory]: { label: string; color: string } } = {
  alimentacao: { label: 'Alimentação & Snacks', color: 'bg-emerald-500' },
  veterinario: { label: 'Consultas Veterinárias', color: 'bg-rose-500' },
  medicacao: { label: 'Medicamentos & Prevenção', color: 'bg-amber-500' },
  higiene: { label: 'Higiene & Banhos / Areia', color: 'bg-blue-500' },
  acessorios: { label: 'Acessórios & Brinquedos', color: 'bg-purple-500' },
  treino: { label: 'Treino & Comportamento', color: 'bg-teal-500' },
  outros: { label: 'Outros Custos', color: 'bg-slate-400' },
};

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  onOpenNewExpenseModal,
  onEditExpense,
}) => {
  const { pets, activePetId, expenses, deleteExpense } = usePetCare();

  const [selectedPetId, setSelectedPetId] = useState<string>(activePetId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Filtered expenses
  const filteredExpenses = expenses
    .filter((e) => {
      if (selectedPetId !== 'all' && e.petId !== selectedPetId) return false;
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (selectedMonth !== 'all' && !e.date.startsWith(selectedMonth)) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Total sum
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amountEuro, 0);

  // Group by category for visual distribution
  const categoryTotals: { [key: string]: number } = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amountEuro;
  });

  // Extract distinct available months from expenses
  const availableMonths = Array.from(new Set(expenses.map((e) => e.date.slice(0, 7)))).sort().reverse();

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Orçamento & Cuidados
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestão de Despesas (€)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controlo rigoroso dos custos veterinários, alimentação e acessórios em euros com relatórios por categoria.
          </p>
        </div>

        <button
          onClick={() => onOpenNewExpenseModal(selectedPetId !== 'all' ? selectedPetId : undefined)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white text-xs font-bold shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registar Despesa</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#154734] to-[#0f3426] text-white shadow-md">
          <span className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">
            Total do Filtro Selecionado
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
            {totalAmount.toFixed(2)} €
          </div>
          <p className="text-xs text-emerald-200/80 mt-1">
            {filteredExpenses.length} despesas registadas
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
            Média por Registo
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : '0.00'} €
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Valor médio investido por entrada
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
            Maior Categoria
          </span>
          {Object.keys(categoryTotals).length > 0 ? (
            (() => {
              const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
              const catConfig = CATEGORY_NAMES[topCat[0] as ExpenseCategory] || { label: topCat[0] };
              return (
                <>
                  <div className="text-xl font-extrabold text-slate-900 mt-1 truncate">
                    {catConfig.label}
                  </div>
                  <p className="text-xs text-[#154734] font-bold mt-1">
                    {topCat[1].toFixed(2)} € ({Math.round((topCat[1] / totalAmount) * 100)}% do total)
                  </p>
                </>
              );
            })()
          ) : (
            <div className="text-sm font-semibold text-slate-400 mt-2">Sem dados</div>
          )}
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      {totalAmount > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Distribuição por Categoria de Cuidado</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const config = CATEGORY_NAMES[cat as ExpenseCategory] || { label: cat, color: 'bg-emerald-600' };
                const pct = Math.round((amount / totalAmount) * 100);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{config.label}</span>
                      <span className="font-extrabold text-slate-900">
                        {amount.toFixed(2)} € <span className="text-slate-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${config.color} h-2.5 rounded-full transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        {/* Pet Filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Animal</label>
          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Todos os Animais</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Todas as Categorias</option>
            {Object.entries(CATEGORY_NAMES).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        {availableMonths.length > 0 && (
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Mês</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
            >
              <option value="all">Todos os Meses</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Histórico de Custos ({filteredExpenses.length})</h3>

        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((exp) => {
            const pet = pets.find((p) => p.id === exp.petId);
            const catConfig = CATEGORY_NAMES[exp.category] || { label: exp.category, color: 'bg-slate-400' };

            return (
              <div
                key={exp.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#154734] flex items-center justify-center font-bold text-sm shrink-0">
                    <Euro className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{exp.description}</span>
                      {pet && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#154734] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <img src={pet.photoUrl} alt={pet.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          <span>{pet.name}</span>
                        </span>
                      )}
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {catConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(exp.date).toLocaleDateString('pt-PT')}</span>
                      </span>
                      {exp.receiptNotes && (
                        <span className="italic truncate max-w-xs text-slate-500">
                          Fatura: {exp.receiptNotes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <span className="text-lg font-extrabold text-[#154734]">
                    {exp.amountEuro.toFixed(2)} €
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditExpense(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Editar despesa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Eliminar despesa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">Nenhuma despesa registada com estes critérios</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Regista faturas de ração, desparasitantes ou consultas para manteres o orçamento equilibrado.
            </p>
            <button
              onClick={() => onOpenNewExpenseModal(selectedPetId !== 'all' ? selectedPetId : undefined)}
              className="mt-2 text-xs font-bold text-[#154734] underline"
            >
              + Adicionar Despesa Agora
            </button>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-500">
        ℹ️ <strong>Nota Financeira:</strong> Este módulo funciona como organizador pessoal para controlo do orçamento familiar. Não realiza cobranças bancárias reais.
      </div>
    </div>
  );
};
