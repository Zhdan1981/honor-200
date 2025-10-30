import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Sun, Moon, Plus, Settings } from 'lucide-react';

interface HeaderProps {
  totalBalance: number;
  toggleTheme: () => void;
  onAddTransaction: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalBalance, toggleTheme, onAddTransaction, onOpenSettings }) => {
  const [lastUpdated] = useState(new Date().getTime());

  return (
    // The outer div handles the safe area padding at the top.
    <div style={{ paddingTop: 'env(safe-area-inset-top, 0rem)' }}>
      <header className="px-4 pt-4 pb-8 relative">
        {/* The icons are absolutely positioned within the padded header area */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-full text-text-secondary hover:bg-card-hover transition-colors"
                aria-label="Настройки"
            >
                <Settings size={20} />
            </button>
            <button
              onClick={onAddTransaction}
              className="p-2 rounded-full text-text-secondary hover:bg-card-hover transition-colors"
              aria-label="Добавить транзакцию"
            >
              <Plus size={20} />
            </button>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-text-secondary hover:bg-card-hover transition-colors"
                aria-label="Переключить тему"
            >
                <Sun size={20} className="hidden dark:block" />
                <Moon size={20} className="block dark:hidden" />
            </button>
        </div>
        
        {/* The main content, now with more top margin to avoid overlapping with the absolute icons */}
        <div className="text-center mt-12">
          <p className="text-sm text-text-secondary">Общий баланс</p>
          <h2 className="text-4xl font-bold text-text-accent my-1">
            {formatCurrency(totalBalance)}
          </h2>
          <p className="text-xs text-text-secondary/80">
            Обновлено: {formatDateTime(lastUpdated).replace(',', '')}
          </p>
        </div>
      </header>
    </div>
  );
};

export default Header;