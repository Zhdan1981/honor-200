import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Sun, Moon, Plus, Settings } from 'lucide-react';
import UndoRedoControls from './UndoRedoControls';

interface HeaderProps {
  totalBalance: number;
  toggleTheme: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddTransaction: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalBalance, toggleTheme, onUndo, onRedo, canUndo, canRedo, onAddTransaction, onOpenSettings }) => {
  const [lastUpdated] = useState(new Date().getTime());

  return (
    <header className="px-4 pt-16 pb-8 text-center relative">
       <div className="absolute top-4 left-4">
            <UndoRedoControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
       </div>
       <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={onAddTransaction}
              className="p-2 rounded-full text-text-secondary hover:bg-card-hover transition-colors"
              aria-label="Добавить транзакцию"
            >
              <Plus size={20} />
            </button>
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-full text-text-secondary hover:bg-card-hover transition-colors"
                aria-label="Настройки"
            >
                <Settings size={20} />
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