import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Sun, Moon } from 'lucide-react';
import UndoRedoControls from './UndoRedoControls';

interface HeaderProps {
  totalBalance: number;
  theme: string;
  toggleTheme: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Header: React.FC<HeaderProps> = ({ totalBalance, theme, toggleTheme, onUndo, onRedo, canUndo, canRedo }) => {
  const [lastUpdated] = useState(new Date().getTime());

  return (
    <header className="px-4 py-8 text-center relative">
       <div className="absolute top-4 left-4">
            <UndoRedoControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
       </div>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        aria-label="Переключить тему"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400">Общий баланс</p>
      <h2 className="text-4xl font-bold text-emerald-400 my-1">
        {formatCurrency(totalBalance)}
      </h2>
      <p className="text-xs text-gray-600 dark:text-gray-500">
        Обновлено: {formatDateTime(lastUpdated).replace(',', '')}
      </p>
    </header>
  );
};

export default Header;
