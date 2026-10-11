export type Species = 'cão' | 'gato' | 'outro';

export type Gender = 'macho' | 'fêmea' | 'indefinido';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  birthDate?: string; // YYYY-MM-DD
  approxAge?: string;
  gender: Gender;
  weightKg?: number;
  arrivalDate?: string; // YYYY-MM-DD
  photoUrl?: string;
  traits: string[]; // e.g. 'Calmo', 'Brincalhão', 'Ansioso com barulhos', 'Sociável'
  allergies?: string;
  specialNeeds?: string;
  notes?: string;
  microchip?: string;
  vetContact?: string;
  createdAt: string;
}

export type TaskCategory =
  | 'alimentacao'
  | 'passeio'
  | 'higiene'
  | 'medicacao'
  | 'veterinario'
  | 'vacinacao'
  | 'desparasitacao'
  | 'treino'
  | 'outro';

export type Recurrence = 'nenhuma' | 'diaria' | 'semanal' | 'mensal';

export interface Task {
  id: string;
  petId: string;
  title: string;
  category: TaskCategory;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  recurrence: Recurrence;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export type PetMood = 'excelente' | 'alegre' | 'calmo' | 'apatico' | 'agitado' | 'dor_desconforto';

export interface DiaryEntry {
  id: string;
  petId: string;
  date: string; // YYYY-MM-DD
  time?: string;
  weightKg?: number;
  mood?: PetMood;
  dietNotes?: string;
  exerciseMinutes?: number;
  hygieneNotes?: string;
  vetObservations?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'alimentacao'
  | 'veterinario'
  | 'medicacao'
  | 'higiene'
  | 'acessorios'
  | 'treino'
  | 'outros';

export interface Expense {
  id: string;
  petId: string;
  date: string; // YYYY-MM-DD
  amountEuro: number;
  category: ExpenseCategory;
  description: string;
  receiptNotes?: string;
  createdAt: string;
}

export type AcademyLevel = 'iniciante' | 'intermedio' | 'avancado';
export type AcademyAge = 'cachorro_gatinho' | 'adulto' | 'senior' | 'todos';

export interface AcademyModule {
  id: string;
  title: string;
  species: Species | 'todos';
  ageGroup: AcademyAge;
  level: AcademyLevel;
  theme: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
  explanation: string;
  stepByStep: string[];
  commonMistakes: string[];
  safetyTips: string[];
  practicalExercise: {
    title: string;
    instructions: string;
    evaluationTip: string;
  };
  sources: string[];
  isEssential?: boolean;
}

export interface HealthArticle {
  id: string;
  title: string;
  category:
    | 'alimentacao'
    | 'higiene'
    | 'prevencao'
    | 'vacinacao'
    | 'desparasitacao'
    | 'saude_oral'
    | 'peso_atividade'
    | 'seniores'
    | 'consultas'
    | 'sinais_alerta'
    | 'seguranca'
    | 'emergencias';
  species: Species | 'todos';
  summary: string;
  content: string;
  keyPoints: string[];
  updateDate: string;
  sources: string[];
  isEmergencyAlert?: boolean;
  canScheduleAction?: {
    suggestedTaskTitle: string;
    category: TaskCategory;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'gratuito' | 'plus';
  joinedDate: string;
  notificationsEnabled: boolean;
}
