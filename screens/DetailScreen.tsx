import React, { useState } from 'react';
// FIX: Import PieChart for the charts button.
import { ArrowLeft, Plus, Trash2, PieChart } from 'lucide-react';
// FIX: Import Transaction type for the new prop.
import type { Category, NewTransactionData, Transaction } from '../types';
import { TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';
import useBudget from '../hooks/useBudget';

interface DetailScreenProps {
  category: Category;
  // FIX: Add missing transactions prop.
  transactions: Transaction[];
  onBack: () => void;
  budgetHook: ReturnType<typeof useBudget>;
  // FIX: Add missing onNavigateToCharts prop.
  onNavigateToCharts: () => void;
}

interface DetailTransactionRow {
    id: number;
    amount: string;
    note: string;
    sourceId: string;
}

// FIX: Accept and destructure new props. The 'transactions' prop is destructured to satisfy TypeScript, although it's not used in the UI.
const DetailScreen: React.FC<DetailScreenProps> = ({ category, onBack, budgetHook, onNavigateToCharts, transactions }) => {
  const { categories, addTransactions } = budgetHook;
  const [operationType, setOperationType] = useState<TransactionType>(TransactionType.EXPENSE);
  
  const createNewRow = (): DetailTransactionRow => ({
    id: Date.now() + Math.random(),
    amount: '',
    note: '',
    sourceId: '',
  });
  
  const [rows, setRows] = useState<DetailTransactionRow[]>([createNewRow()]);

  const handleRowChange = <K extends keyof DetailTransactionRow>(index: number, field: K, value: DetailTransactionRow[K]) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, createNewRow()]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleAdd = () => {
    const transactionsToSave: NewTransactionData[] = rows
        .map(row => {
            const amountValue = parseFloat(row.amount.replace(',', '.'));
            if (!amountValue || amountValue <= 0) {
                return null;
            }

            if (operationType === TransactionType.TRANSFER && !row.sourceId) {
                return null; // For transfers, source is mandatory
            }

            let transactionData: NewTransactionData = {
                amount: amountValue,
                categoryId: category.id,
                note: row.note,
                who: category.name,
                type: operationType,
            };

            if ((operationType === TransactionType.EXPENSE || operationType === TransactionType.TRANSFER) && row.sourceId) {
                transactionData.fromCategoryId = row.sourceId;
            }

            return transactionData;
        })
        .filter((t): t is NewTransactionData => t !== null);

    if (transactionsToSave.length > 0) {
        addTransactions(transactionsToSave);
        onBack();
    }
  };
  
  const sourceCategories = categories.filter(c => c.id !== category.id);

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      <header className="px-4 sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-md" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)', paddingBottom: '0.75rem' }}>
        <div className="flex items-center text-text-primary">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-card-hover">
            <ArrowLeft />
          </button>
          <div className="text-center flex-grow flex items-center justify-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
            <h1 className="text-lg font-bold">{category.name}</h1>
          </div>
          {/* FIX: Add button to navigate to charts screen, replacing placeholder div. */}
          <button onClick={onNavigateToCharts} className="p-2 rounded-full hover:bg-card-hover" aria-label="Показать графики">
            <PieChart />
          </button>
        </div>
        <div className="text-center text-text-primary mt-2">
            <p className="text-3xl font-bold">{formatCurrency(category.balance)}</p>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 text-text-primary no-scrollbar">
        <div className="space-y-4">
            <div>
                <label htmlFor="op_type" className="block text-sm font-medium text-text-secondary mb-1">Тип операции</label>
                <select 
                    id="op_type"
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value as TransactionType)}
                    className="w-full p-3 bg-input-bg border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                    <option value={TransactionType.EXPENSE}>Расход</option>
                    <option value={TransactionType.INCOME}>Доход</option>
                    <option value={TransactionType.TRANSFER}>Перевод</option>
                </select>
            </div>
            
            {rows.map((row, index) => (
                <div key={row.id} className="p-4 bg-card-primary border border-border-primary rounded-xl space-y-4 relative">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-text-secondary">Транзакция {index + 1}</p>
                        {rows.length > 1 && (
                            <button onClick={() => removeRow(index)} className="p-1 text-text-secondary hover:text-red-500">
                                <Trash2 size={16}/>
                            </button>
                        )}
                    </div>
                    <input 
                        type="number" 
                        placeholder="Сумма"
                        value={row.amount}
                        onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                        className="w-full p-3 bg-input-bg border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    />
                    <input 
                        type="text" 
                        placeholder="Описание (необязательно)"
                        value={row.note}
                        onChange={(e) => handleRowChange(index, 'note', e.target.value)}
                        className="w-full p-3 bg-input-bg border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    />
                     {(operationType === TransactionType.EXPENSE || operationType === TransactionType.TRANSFER) && (
                         <div>
                            <label htmlFor={`source-${row.id}`} className="block text-sm font-medium text-text-secondary mb-1">
                                {operationType === TransactionType.EXPENSE ? 'Откуда взять (необязательно)' : 'Откуда взять'}
                            </label>
                            <select 
                                id={`source-${row.id}`}
                                value={row.sourceId}
                                onChange={(e) => handleRowChange(index, 'sourceId', e.target.value)}
                                className="w-full p-3 bg-input-bg border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-focus-ring"
                            >
                                <option value="">{operationType === TransactionType.EXPENSE ? `С кошелька "${category.name}"` : 'Выберите источник'}</option>
                                {sourceCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            ))}

            <button onClick={addRow} className="w-full flex items-center justify-center p-2.5 border-2 border-dashed rounded-lg border-border-primary text-text-secondary hover:bg-card-hover hover:text-text-primary">
                <Plus size={16} className="mr-2" /> Добавить ещё транзакцию
            </button>
        </div>
      </main>
      
      <footer className="px-4 pt-4 grid grid-cols-2 gap-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <button onClick={handleAdd} className="w-full px-4 py-3 bg-btn-primary-bg text-btn-primary-text font-semibold rounded-lg hover:opacity-90 transition-opacity">Добавить</button>
        <button onClick={onBack} className="w-full px-4 py-3 bg-card-hover text-text-secondary font-semibold rounded-lg hover:opacity-90 transition-opacity">Закрыть</button>
      </footer>
    </div>
  );
};

export default DetailScreen;