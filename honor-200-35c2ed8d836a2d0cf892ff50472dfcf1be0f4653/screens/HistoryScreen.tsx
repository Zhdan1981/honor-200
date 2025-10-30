import React, { useState, useMemo } from 'react';
import type { Transaction, Category, Settings } from '../types';
import { TransactionType } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import useBudget from '../hooks/useBudget';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface HistoryScreenProps {
  budgetHook: ReturnType<typeof useBudget>;
  settings: Settings;
}

type SortKey = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ budgetHook, settings }) => {
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
        amountColor = 'text-text-secondary';
        sign = '';
        description = `Перевод из "${fromCategory?.name}" в "${category?.name}"`;
    } else {
        description = `${tx.note || 'Транзакция'} (${category?.name})`
    }

    return (
        <div key={tx.id} className="flex justify-between items-center p-3 mx-4 border-b border-border-primary">
            <div className="min-w-0 mr-4">
                <p className="font-semibold truncate text-text-primary">{description}</p>
                <p className="text-sm text-text-secondary">{formatDateTime(tx.date)} by {tx.who}</p>
            </div>
            <p className={`font-bold whitespace-nowrap ${amountColor}`}>{sign} {formatCurrency(tx.amount)}</p>
        </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      <header className="px-4 sticky top-0 z-10 bg-card-primary/80 backdrop-blur-md border-b border-border-primary" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)', paddingBottom: '1.25rem' }}>
        <h1 className="text-lg font-bold text-center text-text-primary mb-4">История транзакций</h1>
        <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="sort-key" className="text-sm text-text-secondary">Сортировать по:</label>
                <select 
                    id="sort-key"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="p-2 bg-input-bg border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-focus-ring text-sm text-text-primary"
                >
                    <option value="date">Дате</option>
                    <option value="amount">Сумме</option>
                    <option value="category">Категории</option>
                </select>
            </div>
            <button onClick={toggleSortOrder} className="p-2 bg-input-bg border border-border-primary rounded-md hover:bg-card-hover transition-colors text-text-primary">
                {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto no-scrollbar" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <div>
            {sortedTransactions.length > 0 ? sortedTransactions.map(renderTransactionItem) : <p className="text-center p-8 text-text-secondary">Нет транзакций</p>}
        </div>
      </main>
    </div>
  );
};

export default HistoryScreen;