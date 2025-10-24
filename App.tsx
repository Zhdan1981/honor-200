
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import CategoryChartsScreen from './screens/ChartsScreen';
import HistoryScreen from './screens/HistoryScreen';
import GlobalChartsScreen from './screens/GlobalChartsScreen';
import BottomNav from './components/BottomNav';
import useBudget from './hooks/useBudget';
import type { Category } from './types';

type Tab = 'budget' | 'history' | 'charts';

const App: React.FC = () => {
  const budget = useBudget();
  const [activeTab, setActiveTab] = useState<Tab>('budget');
  const [view, setView] = useState<'main' | 'detail' | 'category_charts'>('main');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
      setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('detail');
  };

  const handleNavigateToCharts = () => {
    setView('category_charts');
  };

  const handleBack = () => {
    if (view === 'category_charts') {
      setView('detail');
    } else if (view === 'detail') {
      setSelectedCategory(null);
      setView('main');
    }
  };

  const renderMainView = () => {
      switch (activeTab) {
        case 'budget':
          return <HomeScreen budgetHook={budget} onSelectCategory={handleSelectCategory} theme={theme} toggleTheme={toggleTheme} />;
        case 'history':
          return <HistoryScreen budgetHook={budget} />;
        case 'charts':
          return <GlobalChartsScreen budgetHook={budget} />;
        default:
          return <HomeScreen budgetHook={budget} onSelectCategory={handleSelectCategory} theme={theme} toggleTheme={toggleTheme} />;
      }
  }

  const renderContent = () => {
    if (view === 'main') {
      return renderMainView();
    }
    
    if (selectedCategory) {
        const categoryTransactions = budget.transactions.filter(
            t => t.categoryId === selectedCategory.id || t.fromCategoryId === selectedCategory.id
        );
        if (view === 'detail') {
            return (
              <DetailScreen
                category={selectedCategory}
                transactions={categoryTransactions}
                onBack={handleBack}
                budgetHook={budget}
                onNavigateToCharts={handleNavigateToCharts}
              />
            );
        }
        if (view === 'category_charts') {
            return (
              <CategoryChartsScreen
                category={selectedCategory}
                transactions={categoryTransactions}
                onBack={handleBack}
                budgetHook={budget}
              />
            );
        }
    }
    
    // Fallback to main view
    setView('main');
    return renderMainView();
  };
  
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-black transition-colors duration-500">
      <div className="max-w-screen-md mx-auto bg-gray-100 dark:bg-black min-h-screen">
        {renderContent()}
        {view === 'main' && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
      </div>
    </div>
  );
};

export default App;