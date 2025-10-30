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
    <header className="px-4 pb-8 text-center relative" style={{ paddingTop: 'calc(env(safe-area-inset-top, 1.5rem) + 3.5rem)' }}>
       <div className="absolute right-4 flex items-center gap-2" style={{ top: 'calc(env(safe-area-inset-top, 0.5rem) + 0.5rem)' }}>
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
      <p className="text-sm text-text-secondary">Общий баланс</p>
      <h2 className="text-4xl font-bold text-text-accent my-1">
        {formatCurrency(totalBalance)}
      </h2>
      <p className="text-xs text-text-secondary/80">
        Обновлено: {formatDateTime(lastUpdated).replace(',', '')}
      </p>
    </header>
  );
};

export default Header;