
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Category, Transaction } from '../types';
import { TransactionType } from '../types';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import BalanceLineChart from '../components/charts/BalanceLineChart';
import useBudget from '../hooks/useBudget';

interface CategoryChartsScreenProps {
  category: Category;
  transactions: Transaction[];
  onBack: () => void;
  budgetHook: ReturnType<typeof useBudget>;
}

const CategoryChartsScreen: React.FC<CategoryChartsScreenProps> = ({ category, transactions, onBack, budgetHook }) => {
  const { categories } = budgetHook;
  
  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="px-4 py-3 shadow-md sticky top-0 z-10" style={{ backgroundColor: category.color }}>
        <div className="flex items-center text-white">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20">
            <ArrowLeft />
          </button>
          <div className="text-center flex-grow">
            <h1 className="text-lg font-bold">Диаграммы: {category.name}</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto bg-black">
        <div className="space-y-8 p-4">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-center">Структура расходов и переводов</h3>
                <ExpensePieChart 
                    transactions={transactions.filter(t => (t.type === TransactionType.EXPENSE && t.categoryId === category.id) || (t.type === TransactionType.TRANSFER && t.fromCategoryId === category.id) )} 
                    categories={categories}
                    mode="category"
                />
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4 text-center">Динамика баланса</h3>
                <BalanceLineChart transactions={transactions} category={category} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryChartsScreen;