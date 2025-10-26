import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import useBudget from '../hooks/useBudget';
import type { Category, NewTransactionData, Settings } from '../types';
import UndoRedoToast from '../components/UndoRedoToast';

interface HomeScreenProps {
  budgetHook: ReturnType<typeof useBudget>;
  onSelectCategory: (category: Category) => void;
  toggleTheme: () => void;
  onAddTransaction: () => void;
  onOpenSettings: () => void;
  settings: Settings;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ budgetHook, onSelectCategory, toggleTheme, onAddTransaction, onOpenSettings, settings }) => {
  const { categories, totalBalance, isLoading, addTransactions, updateCategoryBalance, undo, redo, canUndo, canRedo } = budgetHook;
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'undo' | 'redo' } | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

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
        toggleTheme={toggleTheme}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onAddTransaction={onAddTransaction}
        onOpenSettings={onOpenSettings}
      />
      <main className="flex-grow overflow-y-auto pb-20 no-scrollbar">
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