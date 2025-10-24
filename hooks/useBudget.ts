import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Category, Transaction, NewTransactionData } from '../types';
import { TransactionType } from '../types';
import { storageService } from '../services/storage';
import { INITIAL_CATEGORIES, INITIAL_BALANCES } from '../constants';

// Type for a snapshot of the application's state
type BudgetState = {
  categories: Category[];
  transactions: Transaction[];
};

const useBudget = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [history, setHistory] = useState<BudgetState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const loadedCategories = storageService.getCategories();
    const loadedTransactions = storageService.getTransactions();

    if (loadedCategories && loadedTransactions) {
      const initialState = { categories: loadedCategories, transactions: loadedTransactions };
      setCategories(initialState.categories);
      setTransactions(initialState.transactions);
      setHistory([initialState]);
      setHistoryIndex(0);
    } else {
      // Seed initial data
      const initialCategories: Category[] = INITIAL_CATEGORIES.map(cat => ({
        ...cat,
        balance: INITIAL_BALANCES[cat.id] || 0,
      }));
      const initialState = { categories: initialCategories, transactions: [] };
      setCategories(initialState.categories);
      setTransactions(initialState.transactions);
      storageService.saveCategories(initialState.categories);
      storageService.saveTransactions(initialState.transactions);
      setHistory([initialState]);
      setHistoryIndex(0);
    }
    setIsLoading(false);
  }, []);

  const updateState = useCallback((newState: BudgetState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setCategories(newState.categories);
    setTransactions(newState.transactions);
    storageService.saveCategories(newState.categories);
    storageService.saveTransactions(newState.transactions);
  }, [history, historyIndex]);

  const addTransactions = useCallback((newTransactionsData: NewTransactionData[]) => {
      if (newTransactionsData.length === 0) return;

      const newTransactions: Transaction[] = newTransactionsData.map((data, index) => ({
        ...data,
        id: `tx_${new Date().getTime()}_${index}_${Math.random()}`,
        date: new Date().getTime(),
      }));
  
      const balanceDeltas: { [key: string]: number } = {};
      newTransactions.forEach(tx => {
        if (tx.type === TransactionType.TRANSFER) {
          if (tx.fromCategoryId) {
            balanceDeltas[tx.fromCategoryId] = (balanceDeltas[tx.fromCategoryId] || 0) - tx.amount;
          }
          balanceDeltas[tx.categoryId] = (balanceDeltas[tx.categoryId] || 0) + tx.amount;
        } else if (tx.type === TransactionType.EXPENSE) {
          const sourceCategoryId = tx.fromCategoryId || tx.categoryId;
          balanceDeltas[sourceCategoryId] = (balanceDeltas[sourceCategoryId] || 0) - tx.amount;
        } else if (tx.type === TransactionType.INCOME) {
          balanceDeltas[tx.categoryId] = (balanceDeltas[tx.categoryId] || 0) + tx.amount;
        }
      });
  
      const updatedCategories = categories.map(cat => {
        if (balanceDeltas[cat.id]) {
          return { ...cat, balance: cat.balance + balanceDeltas[cat.id] };
        }
        return cat;
      });
  
      const updatedTransactions = [...transactions, ...newTransactions];
      updateState({ categories: updatedCategories, transactions: updatedTransactions });
  }, [categories, transactions, updateState]);

  const updateCategoryBalance = useCallback((categoryId: string, newBalance: number) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId ? { ...cat, balance: newBalance } : cat
    );
    updateState({ categories: updatedCategories, transactions });
  }, [categories, transactions, updateState]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setCategories(previousState.categories);
      setTransactions(previousState.transactions);
      storageService.saveCategories(previousState.categories);
      storageService.saveTransactions(previousState.transactions);
      setHistoryIndex(newIndex);
    }
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setCategories(nextState.categories);
      setTransactions(nextState.transactions);
      storageService.saveCategories(nextState.categories);
      storageService.saveTransactions(nextState.transactions);
      setHistoryIndex(newIndex);
    }
  }, [canRedo, history, historyIndex]);


  const totalBalance = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.balance, 0);
  }, [categories]);

  return {
    categories,
    transactions,
    addTransactions,
    updateCategoryBalance,
    totalBalance,
    isLoading,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useBudget;