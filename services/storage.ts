
import type { Category, Transaction } from '../types';

const CATEGORIES_KEY = 'home_budget_categories';
const TRANSACTIONS_KEY = 'home_budget_transactions';

export const storageService = {
  getCategories: (): Category[] | null => {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : null;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },
  getTransactions: (): Transaction[] | null => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : null;
  },
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },
};
