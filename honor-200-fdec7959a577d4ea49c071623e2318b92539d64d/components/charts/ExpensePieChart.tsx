import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction, Category } from '../../types';
import { TransactionType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ExpensePieChartProps {
  transactions: Transaction[];
  categories: Category[];
  mode: 'global' | 'category';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A855F7', '#EC4899'];

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ transactions, categories, mode }) => {
  
  let data;

  if (mode === 'global') {
    const expenseData = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        const category = categories.find(c => c.id === t.categoryId);
        if (category) {
          if (!acc[category.name]) {
            acc[category.name] = { name: category.name, value: 0, color: category.color };
          }
          acc[category.name].value += t.amount;
        }
        return acc;
      }, {} as {[key: string]: { name: string, value: number, color: string }});
    data = Object.values(expenseData);
  } else { // mode === 'category'
      const outflowData = transactions.reduce((acc, t) => {
        if (t.type === TransactionType.TRANSFER) {
            const toCategory = categories.find(c => c.id === t.categoryId);
            const key = toCategory ? `transfer_${toCategory.id}` : 'transfer_unknown';
            if (!acc[key]) {
                acc[key] = { name: `Перевод: ${toCategory?.name || '??'}`, value: 0, color: toCategory?.color || '#A9A9A9' };
            }
            acc[key].value += t.amount;
        } else if (t.type === TransactionType.EXPENSE) {
            const key = t.note || 'Прочие расходы';
            if (!acc[key]) {
                 acc[key] = { name: key, value: 0, color: null }; // Defer color assignment
            }
            acc[key].value += t.amount;
        }
        return acc;
    }, {} as {[key: string]: { name: string, value: number, color: string | null }});

    // FIX: Explicitly type chartData as Object.values may be inferred as unknown[], causing type errors on `item`.
    const chartData = Object.values(outflowData) as { name: string, value: number, color: string | null }[];
    let expenseColorIndex = 0;
    chartData.forEach(item => {
        if (item.color === null) {
            item.color = COLORS[expenseColorIndex % COLORS.length];
            expenseColorIndex++;
        }
    });
    data = chartData;
  }


  if (data.length === 0) {
      return <div className="text-center p-8 text-gray-500">Нет данных для отображения.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {/* FIX: The 'entry' parameter was inferred as 'unknown', causing an error. Typing it as 'any' bypasses this type inference issue with recharts. */}
          {data.map((entry: any, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Сумма']}/>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;