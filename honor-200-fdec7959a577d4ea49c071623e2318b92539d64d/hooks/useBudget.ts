import { useState, useEffect, useMemo, useCallback } from 'react';
import React from 'react';
import { Banknote } from 'lucide-react';
import type { Category, Transaction, NewTransactionData } from '../types';
import { TransactionType } from '../types';
import { INITIAL_CATEGORIES, INITIAL_BALANCES } from '../constants';
import { db } from '../firebase';
import { collection, onSnapshot, doc, writeBatch, query, orderBy } from 'firebase/firestore';

const useBudget = (userId: string | undefined) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialCategoryMap = useMemo(() => new Map(INITIAL_CATEGORIES.map(c => [c.id, c])), []);

  // Effect for local/anonymous state
  useEffect(() => {
    if (!userId) {
      setIsLoading(true);
      const localInitialCategories = INITIAL_CATEGORIES.map(cat => ({
        ...cat,
        balance: INITIAL_BALANCES[cat.id] || 0,
      }));
      setCategories(localInitialCategories as Category[]);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [userId]);


  const seedInitialData = useCallback(async (uid: string) => {
      const batch = writeBatch(db);
      const categoriesCollectionRef = collection(db, 'users', uid, 'categories');
      
      INITIAL_CATEGORIES.forEach((cat, index) => {
          const docRef = doc(categoriesCollectionRef, cat.id);
          const newCategory = {
              id: cat.id,
              name: cat.name,
              group: cat.group,
              color: cat.color,
              balance: INITIAL_BALANCES[cat.id] || 0,
              order: index,
          };
          batch.set(docRef, newCategory);
      });

      await batch.commit();
  }, []);

  // Effect for Firestore state (when logged in)
  useEffect(() => {
    if (!userId) {
      return;
    }

    setIsLoading(true);

    const categoriesCollectionRef = collection(db, 'users', userId, 'categories');
    const categoriesQuery = query(categoriesCollectionRef, orderBy('order'));
    const transactionsCollectionRef = collection(db, 'users', userId, 'transactions');
    
    const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        if (snapshot.empty && !snapshot.metadata.hasPendingWrites) {
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
      if (newTransactionsData.length === 0) return;

      const balanceDeltas: { [key: string]: number } = {};

      const newTxs = newTransactionsData.map(data => {
        const txId = `tx_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTransaction: Transaction = {
          ...data,
          id: txId,
          date: new Date().getTime(),
        };

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
        return newTransaction;
      });

      // LOCAL STATE LOGIC
      if (!userId) {
          setTransactions(prevTxs => [...prevTxs, ...newTxs]);
          setCategories(prevCats => {
              return prevCats.map(cat => {
                  if (balanceDeltas[cat.id]) {
                      return { ...cat, balance: cat.balance + balanceDeltas[cat.id] };
                  }
                  return cat;
              });
          });
          return;
      }

      // FIRESTORE LOGIC
      const batch = writeBatch(db);
      const transactionsCollectionRef = collection(db, 'users', userId, 'transactions');
      const categoriesCollectionRef = collection(db, 'users', userId, 'categories');

      newTxs.forEach(tx => {
        const txDocRef = doc(transactionsCollectionRef, tx.id);
        batch.set(txDocRef, tx);
      });
      
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
    if (!userId) {
        setCategories(prevCats => prevCats.map(cat => cat.id === categoryId ? { ...cat, balance: newBalance } : cat));
        return;
    }
    const catDocRef = doc(db, 'users', userId, 'categories', categoryId);
    const batch = writeBatch(db);
    batch.update(catDocRef, { balance: newBalance });
    await batch.commit();
  }, [userId]);
  
  const updateCategoryOrder = useCallback(async (orderedCategories: Category[]) => {
    const reordered = orderedCategories.map((c, i) => ({ ...c, order: i }));
    setCategories(reordered);

    if (!userId) return;

    const batch = writeBatch(db);
    const categoriesCollectionRef = collection(db, 'users', userId, 'categories');

    reordered.forEach((category) => {
      const catDocRef = doc(categoriesCollectionRef, category.id);
      batch.update(catDocRef, { order: category.order });
    });

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
    updateCategoryOrder,
    totalBalance,
    isLoading,
  };
};

export default useBudget;