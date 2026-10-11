import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Pet,
  Task,
  DiaryEntry,
  Expense,
  UserProfile,
} from '../types';
import {
  INITIAL_PETS,
  INITIAL_TASKS,
  INITIAL_DIARY,
  INITIAL_EXPENSES,
  INITIAL_USER,
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface PetCareContextType {
  // Pets
  pets: Pet[];
  activePetId: string | null;
  activePet: Pet | null;
  setActivePetId: (id: string | null) => void;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Pet;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Diary
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => DiaryEntry;
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => void;
  deleteDiaryEntry: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Academy Progress
  completedModules: string[];
  toggleModuleCompleted: (id: string) => void;
  favoriteModules: string[];
  toggleModuleFavorite: (id: string) => void;

  // Health
  favoriteArticles: string[];
  toggleArticleFavorite: (id: string) => void;

  // User & GDPR
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  exportDataAsJson: () => void;
  resetAllData: () => void;
  restoreDemoData: () => void;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const PetCareContext = createContext<PetCareContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PETS: 'petcare360_pets_v1',
  ACTIVE_PET: 'petcare360_active_pet_v1',
  TASKS: 'petcare360_tasks_v1',
  DIARY: 'petcare360_diary_v1',
  EXPENSES: 'petcare360_expenses_v1',
  MODULES_DONE: 'petcare360_modules_done_v1',
  MODULES_FAV: 'petcare360_modules_fav_v1',
  ARTICLES_FAV: 'petcare360_articles_fav_v1',
  USER: 'petcare360_user_v1',
};

export const PetCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with local storage fallback
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PETS);
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [activePetId, setActivePetId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PET);
      if (saved) return saved;
      const savedPets = localStorage.getItem(STORAGE_KEYS.PETS);
      const parsed = savedPets ? JSON.parse(savedPets) : INITIAL_PETS;
      return parsed.length > 0 ? parsed[0].id : null;
    } catch {
      return INITIAL_PETS[0]?.id || null;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIARY);
      return saved ? JSON.parse(saved) : INITIAL_DIARY;
    } catch {
      return INITIAL_DIARY;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODULES_DONE);
      return saved ? JSON.parse(saved) : ['mod_cao_1'];
    } catch {
      return ['mod_cao_1'];
    }
  });

  const [favoriteModules, setFavoriteModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODULES_FAV);
      return saved ? JSON.parse(saved) : ['mod_cao_2'];
    } catch {
      return ['mod_cao_2'];
    }
  });

  const [favoriteArticles, setFavoriteArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES_FAV);
      return saved ? JSON.parse(saved) : ['art_1', 'art_2'];
    } catch {
      return ['art_1', 'art_2'];
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    } catch (e) {
      console.error(e);
    }
  }, [pets]);

  useEffect(() => {
    try {
      if (activePetId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PET, activePetId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_PET);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activePetId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(diaryEntries));
    } catch (e) {
      console.error(e);
    }
  }, [diaryEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODULES_DONE, JSON.stringify(completedModules));
    } catch (e) {
      console.error(e);
    }
  }, [completedModules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODULES_FAV, JSON.stringify(favoriteModules));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteModules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES_FAV, JSON.stringify(favoriteArticles));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteArticles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Toast handlers
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Active pet derived
  const activePet = pets.find((p) => p.id === activePetId) || (pets.length > 0 ? pets[0] : null);

  // Pets CRUD
  const addPet = (petData: Omit<Pet, 'id' | 'createdAt'>): Pet => {
    const newPet: Pet = {
      ...petData,
      id: 'pet_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    setPets((prev) => [newPet, ...prev]);
    setActivePetId(newPet.id);
    showToast(`O perfil de ${newPet.name} foi criado com sucesso!`, 'success');
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Perfil do animal atualizado.', 'success');
  };

  const deletePet = (id: string) => {
    const target = pets.find((p) => p.id === id);
    setPets((prev) => prev.filter((p) => p.id !== id));
    // Also remove associated tasks, diary entries, expenses
    setTasks((prev) => prev.filter((t) => t.petId !== id));
    setDiaryEntries((prev) => prev.filter((d) => d.petId !== id));
    setExpenses((prev) => prev.filter((e) => e.petId !== id));

    if (activePetId === id) {
      const remaining = pets.filter((p) => p.id !== id);
      setActivePetId(remaining.length > 0 ? remaining[0].id : null);
    }
    showToast(`Perfil de ${target?.name || 'animal'} eliminado com sucesso.`, 'info');
  };

  // Tasks CRUD
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now().toString(36),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Cuidado agendado com sucesso!', 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Cuidado atualizado.', 'success');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Cuidado removido da agenda.', 'info');
  };

  // Diary CRUD
  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'createdAt'>): DiaryEntry => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: 'diary_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);

    // If entry has weight, also update the pet's current weight
    if (newEntry.weightKg && newEntry.petId) {
      setPets((prev) =>
        prev.map((p) => (p.id === newEntry.petId ? { ...p, weightKg: newEntry.weightKg } : p))
      );
    }

    showToast('Novo registo guardado no diário!', 'success');
    return newEntry;
  };

  const updateDiaryEntry = (id: string, updates: Partial<DiaryEntry>) => {
    setDiaryEntries((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Registo do diário atualizado.', 'success');
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries((prev) => prev.filter((d) => d.id !== id));
    showToast('Registo do diário eliminado.', 'info');
  };

  // Expenses CRUD
  const addExpense = (expData: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExp: Expense = {
      ...expData,
      id: 'exp_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Despesa de ${newExp.amountEuro.toFixed(2)} € registada.`, 'success');
    return newExp;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Despesa atualizada.', 'success');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Despesa eliminada.', 'info');
  };

  // Academy toggles
  const toggleModuleCompleted = (id: string) => {
    setCompletedModules((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((m) => m !== id) : [...prev, id];
      showToast(exists ? 'Módulo desmarcado.' : 'Parabéns! Módulo concluído na Academia.', 'success');
      return next;
    });
  };

  const toggleModuleFavorite = (id: string) => {
    setFavoriteModules((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((m) => m !== id) : [...prev, id];
      showToast(exists ? 'Removido dos favoritos.' : 'Adicionado aos favoritos da Academia.', 'info');
      return next;
    });
  };

  // Health toggles
  const toggleArticleFavorite = (id: string) => {
    setFavoriteArticles((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((a) => a !== id) : [...prev, id];
      showToast(exists ? 'Artigo removido dos guardados.' : 'Artigo guardado para consulta rápida.', 'info');
      return next;
    });
  };

  // User Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    showToast('Perfil de utilizador atualizado.', 'success');
  };

  // RGPD Export
  const exportDataAsJson = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      platform: 'PetCare 360',
      rgpdVersion: '2026-EU-GDPR',
      user: userProfile,
      pets,
      tasks,
      diaryEntries,
      expenses,
      completedModules,
      favoriteModules,
      favoriteArticles,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `petcare360_dados_pessoais_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Exportação RGPD concluída. O ficheiro JSON foi transferido para o teu dispositivo.', 'success');
  };

  // RGPD Reset / Delete all
  const resetAllData = () => {
    setPets([]);
    setActivePetId(null);
    setTasks([]);
    setDiaryEntries([]);
    setExpenses([]);
    setCompletedModules([]);
    setFavoriteModules([]);
    setFavoriteArticles([]);
    localStorage.clear();
    showToast('Todos os dados locais foram eliminados em conformidade com o RGPD.', 'warning');
  };

  // Reset to Demo
  const restoreDemoData = () => {
    setPets(INITIAL_PETS);
    setActivePetId(INITIAL_PETS[0].id);
    setTasks(INITIAL_TASKS);
    setDiaryEntries(INITIAL_DIARY);
    setExpenses(INITIAL_EXPENSES);
    setCompletedModules(['mod_cao_1']);
    setFavoriteModules(['mod_cao_2']);
    setFavoriteArticles(['art_1', 'art_2']);
    setUserProfile(INITIAL_USER);
    showToast('Dados de demonstração restaurados com sucesso!', 'info');
  };

  return (
    <PetCareContext.Provider
      value={{
        pets,
        activePetId,
        activePet,
        setActivePetId,
        addPet,
        updatePet,
        deletePet,
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        diaryEntries,
        addDiaryEntry,
        updateDiaryEntry,
        deleteDiaryEntry,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        completedModules,
        toggleModuleCompleted,
        favoriteModules,
        toggleModuleFavorite,
        favoriteArticles,
        toggleArticleFavorite,
        userProfile,
        updateUserProfile,
        exportDataAsJson,
        resetAllData,
        restoreDemoData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </PetCareContext.Provider>
  );
};

export const usePetCare = (): PetCareContextType => {
  const context = useContext(PetCareContext);
  if (!context) {
    throw new Error('usePetCare deve ser utilizado dentro de um PetCareProvider');
  }
  return context;
};
