import React, { useMemo, useState } from 'react';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import useBudget from '../hooks/useBudget';
import { TransactionType, type Settings } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface GlobalChartsScreenProps {
  budgetHook: ReturnType<typeof useBudget>;
  settings: Settings;
}

type TimePeriod = 'week' | 'month' | 'year' | 'all';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-card-primary p-4 rounded-xl shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${color}20`}}>
            <Icon size={24} style={{ color }}/>
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const GlobalChartsScreen: React.FC<GlobalChartsScreenProps> = ({ budgetHook, settings }) => {
  const { transactions, categories } = budgetHook;
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate = new Date(0);

    switch (timePeriod) {
        case 'week':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        case 'year':
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            break;
        case 'all':
        default:
            // Keep startDate as the beginning of time
            break;
    }
    
    const startTime = startDate.getTime();

    return transactions.filter(t => {
        const isAfterStartDate = t.date >= startTime;
        if (!isAfterStartDate) return false;

        if (selectedCategoryId === 'all') return true;
        
        // For filtering, we care about where the money went (categoryId) for both income and expense
        return t.categoryId === selectedCategoryId;
    });

  }, [transactions, timePeriod, selectedCategoryId]);
  
  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = filteredTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const netIncome = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, netIncome };
  }, [filteredTransactions]);

  const TimePeriodButton: React.FC<{ period: TimePeriod, label: string }> = ({ period, label }) => (
    <button
      onClick={() => setTimePeriod(period)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        timePeriod === period
          ? 'bg-btn-primary-bg text-btn-primary-text'
          : 'bg-input-bg text-text-primary hover:bg-card-hover'
      }`}
    >
      {label}
    </button>
  );
  
  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      <header className="px-4 py-5 text-center sticky top-0 z-10 bg-card-primary/80 backdrop-blur-md border-b border-border-primary">
        <h1 className="text-lg font-bold text-text-primary">Финансовый обзор</h1>
      </header>

      <main className="flex-grow overflow-y-auto pb-20 p-4 no-scrollbar">
        <div className="space-y-6">
            <div className="bg-card-primary p-4 rounded-xl shadow-md space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <TimePeriodButton period="week" label="Неделя" />
                    <TimePeriodButton period="month" label="Месяц" />
                    <TimePeriodButton period="year" label="Год" />
                    <TimePeriodButton period="all" label="Всё время" />
                </div>
                <div>
                     <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="w-full p-2.5 bg-input-bg border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-focus-ring text-sm text-text-primary"
                    >
                        <option value="all">Все категории</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={TrendingUp} title="Общий доход" value={formatCurrency(stats.totalIncome)} color="#22C55E" />
                <StatCard icon={TrendingDown} title="Общий расход" value={formatCurrency(stats.totalExpense)} color="#EF4444" />
                <StatCard icon={Scale} title="Чистый доход" value={formatCurrency(stats.netIncome)} color={stats.netIncome >= 0 ? '#3B82F6' : '#EF4444'} />
            </div>

            <div className="bg-card-primary p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-center text-text-primary">Доходы vs. Расходы</h3>
                <IncomeExpenseBarChart 
                    income={stats.totalIncome} 
                    expense={stats.totalExpense} 
                />
            </div>
            
            {selectedCategoryId === 'all' && (
                <div className="bg-card-primary p-4 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-center text-text-primary">Расходы по категориям</h3>
                    <ExpensePieChart 
                        transactions={filteredTransactions} 
                        categories={categories}
                        mode="global"
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default GlobalChartsScreen;