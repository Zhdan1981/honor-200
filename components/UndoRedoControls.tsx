import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface UndoRedoControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const UndoRedoControls: React.FC<UndoRedoControlsProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
  const buttonClass = "p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const enabledClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800";
  const disabledClass = "text-gray-300 dark:text-gray-600";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`${buttonClass} ${canUndo ? enabledClass : disabledClass}`}
        aria-label="Отменить"
      >
        <Undo2 size={20} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`${buttonClass} ${canRedo ? enabledClass : disabledClass}`}
        aria-label="Вернуть"
      >
        <Redo2 size={20} />
      </button>
    </div>
  );
};

export default UndoRedoControls;
