
import React, { useState, useMemo } from 'react';
import type { Transaction, Category } from '../types';
import { TransactionType } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import useBudget from '../hooks/useBudget';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface HistoryScreenProps {
  budgetHook: ReturnType<typeof useBudget>;
}

type SortKey = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ budgetHook }) => {
  const { transactions, categories } = budgetHook;
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          const categoryA = categories.find(c => c.id === a.categoryId)?.name || '';
          const categoryB = categories.find(c => c.id === b.categoryId)?.name || '';
          comparison = categoryA.localeCompare(categoryB);
          break;
        case 'date':
        default:
          comparison = a.date - b.date;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [transactions, categories, sortKey, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const renderTransactionItem = (tx: Transaction) => {
    const category = categories.find(c => c.id === tx.categoryId);
    const fromCategory = tx.fromCategoryId ? categories.find(c => c.id === tx.fromCategoryId) : null;
    
    const isExpense = tx.type === TransactionType.EXPENSE;
    const isTransfer = tx.type === TransactionType.TRANSFER;
    
    let amountColor = 'text-green-500';
    let sign = '+';
    let description = tx.note || tx.who;
    
    if (isExpense) {
        amountColor = 'text-red-500';
        sign = '-';
    }

    if (isTransfer) {
        amountColor = 'text-gray-400';
        sign = '';
        description = `Перевод из "${fromCategory?.name}" в "${category?.name}"`;
    } else {
        description = `${tx.note || 'Транзакция'} (${category?.name})`
    }

    return (
        <div key={tx.id} className="flex justify-between items-center p-3 mx-4 border-b border-gray-200 dark:border-gray-800">
            <div className="min-w-0 mr-4">
                <p className="font-semibold truncate">{description}</p>
                <p className="text-sm text-gray-500">{formatDateTime(tx.date)} by {tx.who}</p>
            </div>
            <p className={`font-bold whitespace-nowrap ${amountColor}`}>{sign} {formatCurrency(tx.amount)}</p>
        </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-black">
      <header className="px-4 py-5 sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-4">История транзакций</h1>
        <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="sort-key" className="text-sm text-gray-600 dark:text-gray-400">Сортировать по:</label>
                <select 
                    id="sort-key"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="date">Дате</option>
                    <option value="amount">Сумме</option>
                    <option value="category">Категории</option>
                </select>
            </div>
            <button onClick={toggleSortOrder} className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto pb-20">
        <div>
            {sortedTransactions.length > 0 ? sortedTransactions.map(renderTransactionItem) : <p className="text-center p-8 text-gray-500">Нет транзакций</p>}
        </div>
      </main>
    </div>
  );
};

export default HistoryScreen;
