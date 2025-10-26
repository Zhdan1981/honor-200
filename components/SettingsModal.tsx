import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Settings } from '../types';
import { themes } from '../utils/themes';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  user: User | null;
  onLogout: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange, user, onLogout }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Close modal on successful login/signup
    } catch (err) {
      const authError = err as { code: string };
      switch (authError.code) {
        case 'auth/invalid-email': setError('Неверный формат email.'); break;
        case 'auth/user-not-found':
        case 'auth/wrong-password': setError('Неверный email или пароль.'); break;
        case 'auth/email-already-in-use': setError('Этот email уже зарегистрирован.'); break;
        case 'auth/weak-password': setError('Пароль должен содержать не менее 6 символов.'); break;
        default: setError('Произошла ошибка. Попробуйте снова.'); break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-card-primary rounded-2xl shadow-xl w-[95%] max-w-md max-h-[90vh] flex flex-col text-text-primary">
        <div className="p-4 border-b border-border-primary flex justify-between items-center">
          <h2 className="text-lg font-semibold">Настройки</h2>
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
            <label htmlFor="theme-select" className="block mb-2 text-sm font-medium text-text-secondary">
                Тема оформления
            </label>
            <select
                id="theme-select"
                value={settings.themeId}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full p-3 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring"
            >
                {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>
                        {theme.isDark ? '🌙' : '☀️'} {theme.name}
                    </option>
                ))}
            </select>
          </div>
          
          <hr className="border-border-primary" />

          <div>
            <h3 className="mb-3 text-sm font-medium text-text-secondary">Аккаунт</h3>
            {user ? (
              <div className="flex items-center justify-between bg-input-bg p-3 rounded-lg">
                  <div>
                      <p className="text-sm">Вы вошли как:</p>
                      <p className="font-semibold text-text-primary">{user.email}</p>
                  </div>
                  <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold bg-card-hover rounded-lg hover:opacity-80">Выйти</button>
              </div>
            ) : (
               <div className="space-y-4">
                  <p className="text-sm text-center text-text-secondary">{isLogin ? 'Войдите, чтобы синхронизировать данные' : 'Создайте аккаунт для синхронизации'}</p>
                  {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md text-center text-sm">{error}</p>}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2.5 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring"
                          placeholder="Email"
                      />
                      <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-2.5 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring"
                          placeholder="Пароль"
                      />
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-btn-primary-text bg-btn-primary-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-ring disabled:opacity-50"
                      >
                          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
                      </button>
                  </form>
                  <p className="text-center text-sm text-text-secondary">
                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-text-accent hover:underline ml-1">
                        {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
                    </button>
                  </p>
               </div>
            )}
          </div>

        </div>
        
        <div className="p-4 mt-auto border-t border-border-primary">
          <button onClick={onClose} className="w-full px-4 py-3 bg-card-hover text-text-secondary font-semibold rounded-lg hover:opacity-90 transition-opacity">Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;