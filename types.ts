// FIX: Import React to make React.FC available.
import type React from 'react';

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export interface Transaction {
  id: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  who: string;
  note: string;
  date: number; // timestamp
  fromCategoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  group: string;
  balance: number;
  previousBalance?: number;
  // FIX: Allow style prop for category icons.
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

export interface NewTransactionData {
    type: TransactionType;
    amount: number;
    who: string;
    note: string;
    categoryId: string;
    fromCategoryId?: string;
}

export interface Settings {
  bottomNavOpacity: number;
  themeId: string;
}