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
  icon: React.FC<{ className?: string }>;
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