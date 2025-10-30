import React, { useState, useEffect, useRef } from 'react';
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
  settings: Settings;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ budgetHook, onSelectCategory, toggleTheme, onAddTransaction, onOpenSettings, settings }) => {
  const { categories, totalBalance, isLoading, updateCategoryBalance, updateCategoryOrder } = budgetHook;

  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setDraggingIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const reorderedCategories = [...localCategories];
      const draggedItemContent = reorderedCategories.splice(dragItem.current, 1)[0];
      reorderedCategories.splice(dragOverItem.current, 0, draggedItemContent);
      
      updateCategoryOrder(reorderedCategories);
      setLocalCategories(reorderedCategories);
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingIndex(null);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
      />
      <main className="flex-grow overflow-y-auto no-scrollbar" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div className="flex flex-col pt-2">
          {localCategories.length > 0 ? (
              localCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${draggingIndex === index ? 'opacity-50 scale-105 shadow-2xl' : ''}`}
                >
                  <CategoryCard
                    category={cat}
                    onSelect={onSelectCategory}
                    onUpdateBalance={updateCategoryBalance}
                  />
                </div>
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