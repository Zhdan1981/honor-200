import React from 'react';
import { X } from 'lucide-react';
import type { Settings } from '../types';
import { themes } from '../utils/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      bottomNavOpacity: parseInt(e.target.value, 10),
    });
  };
  
  const handleThemeChange = (themeId: string) => {
    onSettingsChange({
      ...settings,
      themeId,
    });
  };

  const ThemePreview: React.FC<{ theme: typeof themes[0], isSelected: boolean, onClick: () => void }> = ({ theme, isSelected, onClick }) => (
    <div className="text-center">
      <button
        onClick={onClick}
        className={`w-full h-16 rounded-lg border-2 transition-all flex items-stretch overflow-hidden ${
          isSelected ? 'border-focus-ring ring-2 ring-focus-ring ring-offset-2 ring-offset-card-primary' : 'border-border-primary'
        }`}
        aria-label={`Выбрать тему ${theme.name}`}
      >
        <div className="w-1/2 h-full" style={{ backgroundColor: `rgb(${theme.colors['--color-background']})` }}></div>
        <div className="w-1/2 h-full flex flex-col">
            <div className="h-1/2 w-full" style={{ backgroundColor: `rgb(${theme.colors['--color-card']})` }}></div>
            <div className="h-1/2 w-full" style={{ backgroundColor: `rgb(${theme.colors['--color-text-accent']})` }}></div>
        </div>
      </button>
      <span className="text-xs mt-1.5 block text-text-secondary">{theme.name}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-card-primary rounded-2xl shadow-xl w-[95%] max-w-md max-h-[90vh] flex flex-col text-text-primary">
        <div className="p-4 border-b border-border-primary flex justify-between items-center">
          <h2 className="text-lg font-semibold">Настройки приложения</h2>
          <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-card-hover">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
          <div>
            <label htmlFor="opacity-slider" className="block mb-2 text-sm font-medium text-text-secondary">
              Прозрачность нижней панели: {settings.bottomNavOpacity}%
            </label>
            <input
              id="opacity-slider"
              type="range"
              min="0"
              max="100"
              value={settings.bottomNavOpacity}
              onChange={handleOpacityChange}
              className="w-full h-2 bg-input-bg rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-text-secondary">Темы оформления</h3>
            <div className="grid grid-cols-3 gap-4">
              {themes.map(theme => (
                <ThemePreview 
                    key={theme.id}
                    theme={theme}
                    isSelected={settings.themeId === theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 mt-auto">
          <button onClick={onClose} className="w-full px-4 py-3 bg-btn-primary-bg text-btn-primary-text font-semibold rounded-lg hover:opacity-90 transition-opacity">Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;