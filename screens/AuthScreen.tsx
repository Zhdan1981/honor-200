import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            // FIX: The AuthError type from firebase/auth does not have the 'code' property in this context.
            // Casting to a generic object with a 'code' property for robust error handling.
            const authError = err as { code: string };
            switch (authError.code) {
                case 'auth/invalid-email':
                    setError('Неверный формат email.');
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                     setError('Неверный email или пароль.');
                     break;
                case 'auth/email-already-in-use':
                    setError('Этот email уже зарегистрирован.');
                    break;
                case 'auth/weak-password':
                    setError('Пароль должен содержать не менее 6 символов.');
                    break;
                default:
                    setError('Произошла ошибка. Попробуйте снова.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
            <div className="max-w-md w-full bg-card-primary p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
                    {isLogin ? 'Вход в систему' : 'Регистрация'}
                </h2>
                <p className="text-center text-text-secondary mb-8">
                    {isLogin ? 'Войдите, чтобы увидеть ваш бюджет' : 'Создайте аккаунт для синхронизации'}
                </p>
                
                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring"
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Пароль</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring"
                            placeholder="Пароль"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-btn-primary-text bg-btn-primary-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-ring disabled:opacity-50"
                        >
                            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Создать аккаунт')}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-text-accent hover:underline ml-1">
                        {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;