import React from 'react';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import useBudget from '../hooks/useBudget';
import type { Category, Settings } from '../types';

interface HomeScreenProps {
  budgetHook: ReturnType<typeof useBudget>;
  onSelectCategory: (category: Category) => void;
  toggleTheme: () => void;
  onAddTransaction: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  settings: Settings;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ budgetHook, onSelectCategory, toggleTheme, onAddTransaction, onOpenSettings, onLogout, settings }) => {
  const { categories, totalBalance, isLoading, updateCategoryBalance } = budgetHook;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-text-secondary">Синхронизация данных...</div>;
  }

  return (
    <div className="flex flex-col h-screen relative">
      <Header 
        totalBalance={totalBalance} 
        toggleTheme={toggleTheme}
        onAddTransaction={onAddTransaction}
        onOpenSettings={onOpenSettings}
        onLogout={onLogout}
      />
      <main className="flex-grow overflow-y-auto pb-20 no-scrollbar">
        <div className="flex flex-col pt-2">
          {categories.length > 0 ? (
              categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onSelect={onSelectCategory}
                  onUpdateBalance={updateCategoryBalance}
                />
              ))
          ) : (
             <div className="text-center p-8 text-text-secondary">
                <p>Категорий пока нет.</p>
                <p className="text-sm mt-2">Приложение создает для вас набор категорий по умолчанию. Это может занять несколько секунд.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;