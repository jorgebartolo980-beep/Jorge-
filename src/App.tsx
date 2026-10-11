import React, { useState } from 'react';
import { PetCareProvider } from './context/PetCareContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Views
import { HomeView } from './components/views/HomeView';
import { DashboardView } from './components/views/DashboardView';
import { PetsView } from './components/views/PetsView';
import { CalendarView } from './components/views/CalendarView';
import { DiaryView } from './components/views/DiaryView';
import { ExpensesView } from './components/views/ExpensesView';
import { AcademyView } from './components/views/AcademyView';
import { HealthView } from './components/views/HealthView';
import { AssistantView } from './components/views/AssistantView';
import { AdoptionView } from './components/views/AdoptionView';
import { PlansView } from './components/views/PlansView';
import { CheckoutView } from './components/views/CheckoutView';
import { AdminView } from './components/views/AdminView';
import { TestSandboxView } from './components/views/TestSandboxView';
import { PublishGuideView } from './components/views/PublishGuideView';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Modals
import { PetModal } from './components/modals/PetModal';
import { TaskModal } from './components/modals/TaskModal';
import { DiaryModal } from './components/modals/DiaryModal';
import { ExpenseModal } from './components/modals/ExpenseModal';
import { PrivacyTermsModal } from './components/modals/PrivacyTermsModal';
import { DataManagementModal } from './components/modals/DataManagementModal';
import { AuthModal } from './components/auth/AuthModal';
import { Pet, Task, DiaryEntry, Expense, TaskCategory } from './types';
import { PlanType } from './types/auth';

function PetCareMainApp() {
  const [currentView, setCurrentView] = useState<string>('home');

  // Modals state
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskDefaultPetId, setTaskDefaultPetId] = useState<string | undefined>(undefined);
  const [taskDefaultCategory, setTaskDefaultCategory] = useState<TaskCategory | undefined>(undefined);
  const [taskDefaultTitle, setTaskDefaultTitle] = useState<string | undefined>(undefined);

  const [diaryModalOpen, setDiaryModalOpen] = useState(false);
  const [diaryToEdit, setDiaryToEdit] = useState<DiaryEntry | null>(null);
  const [diaryDefaultPetId, setDiaryDefaultPetId] = useState<string | undefined>(undefined);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseDefaultPetId, setExpenseDefaultPetId] = useState<string | undefined>(undefined);

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);

  // Modal handlers
  const handleOpenNewPetModal = () => {
    setPetToEdit(null);
    setPetModalOpen(true);
  };

  const handleEditPet = (pet: Pet) => {
    setPetToEdit(pet);
    setPetModalOpen(true);
  };

  const handleOpenNewTaskModal = (
    defaultPetId?: string,
    defaultCategory?: TaskCategory,
    defaultTitle?: string
  ) => {
    setTaskToEdit(null);
    setTaskDefaultPetId(defaultPetId);
    setTaskDefaultCategory(defaultCategory);
    setTaskDefaultTitle(defaultTitle);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleOpenNewDiaryModal = (defaultPetId?: string) => {
    setDiaryToEdit(null);
    setDiaryDefaultPetId(defaultPetId);
    setDiaryModalOpen(true);
  };

  const handleEditDiary = (entry: DiaryEntry) => {
    setDiaryToEdit(entry);
    setDiaryModalOpen(true);
  };

  const handleOpenNewExpenseModal = (defaultPetId?: string) => {
    setExpenseToEdit(null);
    setExpenseDefaultPetId(defaultPetId);
    setExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setExpenseModalOpen(true);
  };

  const handleScheduleFromHealth = (title: string, category: TaskCategory) => {
    handleOpenNewTaskModal(undefined, category, title);
  };

  const handleCheckoutSuccess = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-800">
      {/* Top Urgent Medical Guidance */}
      <EmergencyBanner />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenNewPetModal={handleOpenNewPetModal}
        onOpenDataModal={() => setDataModalOpen(true)}
        onOpenCheckout={() => setCurrentView('checkout')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'home' && (
          <HomeView
            onNavigate={setCurrentView}
            onOpenNewPetModal={handleOpenNewPetModal}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentView}
            onOpenNewTaskModal={handleOpenNewTaskModal}
            onOpenNewDiaryModal={handleOpenNewDiaryModal}
            onOpenNewExpenseModal={handleOpenNewExpenseModal}
            onOpenNewPetModal={handleOpenNewPetModal}
          />
        )}

        {currentView === 'pets' && (
          <PetsView
            onOpenNewPetModal={handleOpenNewPetModal}
            onEditPet={handleEditPet}
            onNavigateToCalendar={() => setCurrentView('calendar')}
            onNavigateToDiary={() => setCurrentView('diary')}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            onOpenNewTaskModal={handleOpenNewTaskModal}
            onEditTask={handleEditTask}
          />
        )}

        {currentView === 'diary' && (
          <DiaryView
            onOpenNewDiaryModal={handleOpenNewDiaryModal}
            onEditDiaryEntry={handleEditDiary}
          />
        )}

        {currentView === 'expenses' && (
          <ExpensesView
            onOpenNewExpenseModal={handleOpenNewExpenseModal}
            onEditExpense={handleEditExpense}
          />
        )}

        {currentView === 'academy' && <AcademyView />}

        {currentView === 'health' && (
          <HealthView onScheduleCare={handleScheduleFromHealth} />
        )}

        {currentView === 'assistant' && (
          <AssistantView onNavigateToPlans={() => setCurrentView('checkout')} />
        )}

        {currentView === 'adoption' && <AdoptionView />}

        {currentView === 'plans' && (
          <PlansView onNavigateToCheckout={() => setCurrentView('checkout')} />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onSuccess={handleCheckoutSuccess}
            onNavigateToPlans={() => setCurrentView('plans')}
          />
        )}

        {currentView === 'admin' && (
          <AdminView onNavigateToSandbox={() => setCurrentView('sandbox')} />
        )}

        {currentView === 'sandbox' && <TestSandboxView />}

        {currentView === 'publish' && (
          <PublishGuideView onNavigate={setCurrentView} />
        )}
      </main>

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Modals */}
      <PetModal
        isOpen={petModalOpen}
        onClose={() => setPetModalOpen(false)}
        petToEdit={petToEdit}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        defaultPetId={taskDefaultPetId}
        defaultCategory={taskDefaultCategory}
        defaultTitle={taskDefaultTitle}
      />

      <DiaryModal
        isOpen={diaryModalOpen}
        onClose={() => setDiaryModalOpen(false)}
        entryToEdit={diaryToEdit}
        defaultPetId={diaryDefaultPetId}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        expenseToEdit={expenseToEdit}
        defaultPetId={expenseDefaultPetId}
      />

      <PrivacyTermsModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <DataManagementModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Toast Feedback */}
      <ToastContainer />

      {/* Footer */}
      <Footer
        onOpenPrivacyTerms={() => setPrivacyModalOpen(true)}
        onOpenDataModal={() => setDataModalOpen(true)}
        onNavigate={setCurrentView}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PetCareProvider>
        <PetCareMainApp />
      </PetCareProvider>
    </AuthProvider>
  );
}
