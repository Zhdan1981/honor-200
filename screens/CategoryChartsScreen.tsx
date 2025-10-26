import React, { useMemo } from 'react';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { Category, Transaction } from '../types';
import { TransactionType } from '../types';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import BalanceLineChart from '../components/charts/BalanceLineChart';
import useBudget from '../hooks/useBudget';
import { formatCurrency } from '../utils/formatters';

interface CategoryChartsScreenProps {
  category: Category;
  transactions: Transaction[];
  onBack: () => void;
  budgetHook: ReturnType<typeof useBudget>;
}

const ChartStatCard: React.FC<{ icon: React.ElementType, title: string, value: string, colorClass: string }> = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-card-hover p-4 rounded-lg flex items-center text-text-primary">
        <Icon className={`w-8 h-8 mr-3 ${colorClass}`} />
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="font-bold text-lg">{value}</p>
        </div>
    </div>
);

const CategoryChartsScreen: React.FC<CategoryChartsScreenProps> = ({ category, transactions, onBack, budgetHook }) => {
  const { categories } = budgetHook;

  const categoryStats = useMemo(() => {
    const inflows = transactions
      .filter(t => t.categoryId === category.id && (t.type === TransactionType.INCOME || t.type === TransactionType.TRANSFER))
      .reduce((sum, t) => sum + t.amount, 0);

    const outflows = transactions
      .filter(t => (t.categoryId === category.id && t.type === TransactionType.EXPENSE) || (t.fromCategoryId === category.id && t.type === TransactionType.TRANSFER))
      .reduce((sum, t) => sum + t.amount, 0);
      
    return { inflows, outflows };
  }, [transactions, category.id]);

  const outflowTransactions = transactions.filter(t => (t.type === TransactionType.EXPENSE && t.fromCategoryId === category.id) || (t.type === TransactionType.TRANSFER && t.fromCategoryId === category.id) || (t.type === TransactionType.EXPENSE && t.categoryId === category.id && !t.fromCategoryId) );

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary">
      <header className="px-4 py-3 shadow-md sticky top-0 z-10" style={{ backgroundColor: category.color }}>
        <div className="flex items-center text-white">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft />
          </button>
          <div className="text-center flex-grow">
            <h1 className="text-lg font-bold">Аналитика: {category.name}</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto no-scrollbar">
        <div className="space-y-8 p-4">
            <div className="grid grid-cols-2 gap-4">
                <ChartStatCard icon={ArrowUpCircle} title="Всего поступлений" value={formatCurrency(categoryStats.inflows)} colorClass="text-green-400" />
                <ChartStatCard icon={ArrowDownCircle} title="Всего списаний" value={formatCurrency(categoryStats.outflows)} colorClass="text-red-400" />
            </div>

            <div className="bg-card-primary p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-center">Динамика баланса</h3>
                <BalanceLineChart transactions={transactions} category={category} />
            </div>

            {outflowTransactions.length > 0 && (
              <div className="bg-card-primary p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 text-center">Куда ушли деньги</h3>
                  <ExpensePieChart 
                      transactions={outflowTransactions} 
                      categories={categories}
                      mode="category"
                  />
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CategoryChartsScreen;