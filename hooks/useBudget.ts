import { useState, useEffect, useMemo, useCallback } from 'react';
import React from 'react';
import { Banknote } from 'lucide-react';
import type { Category, Transaction, NewTransactionData } from '../types';
import { TransactionType } from '../types';
import { INITIAL_CATEGORIES, INITIAL_BALANCES } from '../constants';
import { db } from '../firebase';
import { collection, onSnapshot, doc, writeBatch, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';

const useBudget = (userId: string | undefined) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialCategoryMap = useMemo(() => new Map(INITIAL_CATEGORIES.map(c => [c.id, c])), []);

  const seedInitialData = useCallback(async (uid: string) => {
      const batch = writeBatch(db);
      const categoriesCollectionRef = collection(db, 'users', uid, 'categories');
      
      INITIAL_CATEGORIES.forEach(cat => {
          const docRef = doc(categoriesCollectionRef, cat.id);
          const newCategory = {
              id: cat.id,
              name: cat.name,
              group: cat.group,
              color: cat.color,
              balance: INITIAL_BALANCES[cat.id] || 0
          };
          batch.set(docRef, newCategory);
      });

      await batch.commit();
  }, []);

  useEffect(() => {
    if (!userId) {
      setCategories([]);
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const categoriesCollectionRef = collection(db, 'users', userId, 'categories');
    const transactionsCollectionRef = collection(db, 'users', userId, 'transactions');
    
    const unsubscribeCategories = onSnapshot(categoriesCollectionRef, (snapshot) => {
        if (snapshot.empty) {
            seedInitialData(userId);
        } else {
            const fetchedCategories = snapshot.docs.map(doc => {
                const data = doc.data();
                const initialCat = initialCategoryMap.get(data.id);
                return {
                  ...data,
                  icon: initialCat ? initialCat.icon : (props) => React.createElement(Banknote, { ...props }),
                } as Category;
            });
            setCategories(fetchedCategories);
        }
        setIsLoading(false);
    });

    const unsubscribeTransactions = onSnapshot(transactionsCollectionRef, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => doc.data() as Transaction);
      setTransactions(fetchedTransactions);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeTransactions();
    };
  }, [userId, initialCategoryMap, seedInitialData]);

  const addTransactions = useCallback(async (newTransactionsData: NewTransactionData[]) => {
      if (newTransactionsData.length === 0 || !userId) return;

      const batch = writeBatch(db);
      const transactionsCollectionRef = collection(db, 'users', userId, 'transactions');
      const categoriesCollectionRef = collection(db, 'users', userId, 'categories');

      const balanceDeltas: { [key: string]: number } = {};

      newTransactionsData.forEach(data => {
        const txId = `tx_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTransaction: Transaction = {
          ...data,
          id: txId,
          date: new Date().getTime(),
        };

        const txDocRef = doc(transactionsCollectionRef, txId);
        batch.set(txDocRef, newTransaction);
        
        // Calculate balance changes
        if (newTransaction.type === TransactionType.TRANSFER) {
          if (newTransaction.fromCategoryId) {
            balanceDeltas[newTransaction.fromCategoryId] = (balanceDeltas[newTransaction.fromCategoryId] || 0) - newTransaction.amount;
          }
          balanceDeltas[newTransaction.categoryId] = (balanceDeltas[newTransaction.categoryId] || 0) + newTransaction.amount;
        } else if (newTransaction.type === TransactionType.EXPENSE) {
          const sourceCategoryId = newTransaction.fromCategoryId || newTransaction.categoryId;
          balanceDeltas[sourceCategoryId] = (balanceDeltas[sourceCategoryId] || 0) - newTransaction.amount;
        } else if (newTransaction.type === TransactionType.INCOME) {
          balanceDeltas[newTransaction.categoryId] = (balanceDeltas[newTransaction.categoryId] || 0) + newTransaction.amount;
        }
      });
      
      // Apply balance changes
      for (const categoryId in balanceDeltas) {
          const category = categories.find(c => c.id === categoryId);
          if (category) {
              const catDocRef = doc(categoriesCollectionRef, categoryId);
              const newBalance = category.balance + balanceDeltas[categoryId];
              batch.update(catDocRef, { balance: newBalance });
          }
      }

      await batch.commit();

  }, [userId, categories]);

  const updateCategoryBalance = useCallback(async (categoryId: string, newBalance: number) => {
    if (!userId) return;
    const catDocRef = doc(db, 'users', userId, 'categories', categoryId);
    const batch = writeBatch(db);
    batch.update(catDocRef, { balance: newBalance });
    await batch.commit();
  }, [userId]);

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
  };
};

export default useBudget;