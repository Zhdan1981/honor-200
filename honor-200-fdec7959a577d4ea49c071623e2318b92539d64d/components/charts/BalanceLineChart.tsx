
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction, Category } from '../../types';
import { TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface BalanceLineChartProps {
  transactions: Transaction[];
  category: Category;
}

const BalanceLineChart: React.FC<BalanceLineChartProps> = ({ transactions, category }) => {
  const sortedTransactions = [...transactions].sort((a, b) => a.date - b.date);

  let runningBalance = category.balance; // Start from current balance and work backwards
  const balanceHistory = sortedTransactions.map(t => {
      const prevBalance = runningBalance;
      const amountChange = (t.type === TransactionType.EXPENSE && t.categoryId === category.id) || (t.type === TransactionType.TRANSFER && t.fromCategoryId === category.id) ? t.amount : -t.amount;
      runningBalance += amountChange;
      return {
          date: t.date,
          balance: prevBalance
      }
  }).reverse(); // Reverse back to chronological order

  if(balanceHistory.length < 2) {
       return <div className="text-center p-8 text-gray-500">Недостаточно данных для построения графика.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={balanceHistory}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis tickFormatter={(value) => formatCurrency(value)} width={100} />
        <Tooltip 
            labelFormatter={formatDate}
            formatter={(value: number) => [formatCurrency(value), 'Баланс']}
        />
        <Legend />
        <Line type="monotone" dataKey="balance" name="Баланс" stroke={category.color} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceLineChart;