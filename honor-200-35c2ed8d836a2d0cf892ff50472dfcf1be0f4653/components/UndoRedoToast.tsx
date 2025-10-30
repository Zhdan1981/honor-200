import React, { useEffect, useState } from 'react';
import { Undo2, Redo2, X } from 'lucide-react';

interface UndoRedoToastProps {
  message: string;
  type: 'undo' | 'redo';
  onClose: () => void;
  onAction: () => void;
}

const UndoRedoToast: React.FC<UndoRedoToastProps> = ({ message, type, onClose, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  const handleActionClick = () => {
    onAction();
    handleClose();
  };

  const actionText = type === 'undo' ? 'Вернуть' : 'Отменить';
  const Icon = type === 'undo' ? Redo2 : Undo2;

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 rounded-xl shadow-lg flex items-center justify-between text-text-primary transition-all duration-300 ease-in-out ${
        isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
      } bg-card-primary border border-border-primary`}
    >
      <div className="flex items-center">
        <p className="mr-4 text-sm">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleActionClick}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-md bg-card-hover hover:opacity-80"
        >
          <Icon size={16} />
          {actionText}
        </button>
        <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-card-hover">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default UndoRedoToast;