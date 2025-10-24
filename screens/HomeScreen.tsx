import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import useBudget from '../hooks/useBudget';
import type { Category, NewTransactionData } from '../types';
import { Plus } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import UndoRedoToast from '../components/UndoRedoToast';

interface HomeScreenProps {
  budgetHook: ReturnType<typeof useBudget>;
  onSelectCategory: (category: Category) => void;
  theme: string;
  toggleTheme: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ budgetHook, onSelectCategory, theme, toggleTheme }) => {
  const { categories, totalBalance, isLoading, addTransaction, updateCategoryBalance, undo, redo, canUndo, canRedo } = budgetHook;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'undo' | 'redo' } | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }
    
  const handleSaveTransaction = (data: NewTransactionData[]) => {
    data.forEach(d => addTransaction(d));
    setIsModalOpen(false);
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      setToastInfo({ message: 'Последнее действие отменено', type: 'undo' });
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
      setToastInfo({ message: 'Действие возвращено', type: 'redo' });
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <Header 
        totalBalance={totalBalance} 
        theme={theme} 
        toggleTheme={toggleTheme}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <main className="flex-grow overflow-y-auto pb-24">
        <div className="flex flex-col pt-2">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onSelect={onSelectCategory}
              onUpdateBalance={updateCategoryBalance}
            />
          ))}
        </div>
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-20 right-6 h-14 w-14 bg-blue-500/75 dark:bg-blue-600/75 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600/90 dark:hover:bg-blue-700/90 transition-all z-20"
        aria-label="Добавить транзакцию"
      >
        <Plus size={28} />
      </button>

      {isModalOpen && (
        <TransactionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTransaction}
            categories={categories}
            defaultCategoryId={categories[0]?.id || ''}
        />
      )}

      {toastInfo && (
        <UndoRedoToast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
          onAction={toastInfo.type === 'undo' ? handleRedo : handleUndo}
        />
      )}
    </div>
  );
};

export default HomeScreen;
