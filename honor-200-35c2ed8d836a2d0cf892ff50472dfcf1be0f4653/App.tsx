import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import CategoryChartsScreen from './screens/CategoryChartsScreen';
import HistoryScreen from './screens/HistoryScreen';
import GlobalChartsScreen from './screens/GlobalChartsScreen';
import BottomNav from './components/BottomNav';
import useBudget from './hooks/useBudget';
import type { Category, NewTransactionData, Settings } from './types';
import TransactionModal from './components/TransactionModal';
import SettingsModal from './components/SettingsModal';
import { themes } from './utils/themes';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

type Tab = 'budget' | 'history' | 'charts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const budget = useBudget(user?.uid);
  const [activeTab, setActiveTab] = useState<Tab>('budget');
  const [view, setView] = useState<'main' | 'detail' | 'category_charts'>('main');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    bottomNavOpacity: 40,
    themeId: 'dark-ocean',
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      if (!parsedSettings.themeId) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        parsedSettings.themeId = prefersDark ? 'dark-ocean' : 'light-day';
      }
      setSettings(parsedSettings);
    } else {
       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       setSettings(s => ({...s, themeId: prefersDark ? 'dark-ocean' : 'light-day'}));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));

    const selectedTheme = themes.find(t => t.id === settings.themeId) || themes[0];

    if (selectedTheme) {
        const root = document.documentElement;
        root.classList.toggle('dark', selectedTheme.isDark);
        
        for (const [key, value] of Object.entries(selectedTheme.colors)) {
            root.style.setProperty(key, value);
        }
    }
  }, [settings]);
  
  const toggleTheme = () => {
      setSettings(prevSettings => {
          const currentTheme = themes.find(t => t.id === prevSettings.themeId);
          const newThemeId = currentTheme?.isDark ? 'light-day' : 'dark-ocean';
          return { ...prevSettings, themeId: newThemeId };
      });
  };
  
  const handleLogout = () => {
      signOut(auth);
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

  const handleSaveTransaction = (data: NewTransactionData[]) => {
    budget.addTransactions(data);
    setIsModalOpen(false);
  };

  const renderMainView = () => {
      switch (activeTab) {
        case 'budget':
          return <HomeScreen budgetHook={budget} onSelectCategory={handleSelectCategory} toggleTheme={toggleTheme} onAddTransaction={() => setIsModalOpen(true)} onOpenSettings={() => setIsSettingsModalOpen(true)} settings={settings} />;
        case 'history':
          return <HistoryScreen budgetHook={budget} settings={settings} />;
        case 'charts':
          return <GlobalChartsScreen budgetHook={budget} settings={settings} />;
        default:
          return <HomeScreen budgetHook={budget} onSelectCategory={handleSelectCategory} toggleTheme={toggleTheme} onAddTransaction={() => setIsModalOpen(true)} onOpenSettings={() => setIsSettingsModalOpen(true)} settings={settings} />;
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
    
    setView('main');
    return renderMainView();
  };
  
  const renderApp = () => {
    return (
      <>
        {renderContent()}
        {view === 'main' && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} opacity={settings.bottomNavOpacity} />}
        {isModalOpen && view === 'main' && (
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
                categories={budget.categories}
                defaultCategoryId={budget.categories[0]?.id || ''}
            />
        )}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
          user={user}
          onLogout={handleLogout}
        />
      </>
    );
  }
  
  return (
    <div className="min-h-screen text-text-primary bg-bg-primary transition-colors duration-300">
      <div 
        className="max-w-screen-md mx-auto bg-bg-primary min-h-screen"
      >
        {renderApp()}
      </div>
    </div>
  );
};

export default App;