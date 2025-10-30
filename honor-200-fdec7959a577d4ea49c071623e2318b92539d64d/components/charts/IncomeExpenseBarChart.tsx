import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface IncomeExpenseBarChartProps {
  income: number;
  expense: number;
}

const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({ income, expense }) => {
  const data = [
    { name: 'Доходы', value: income, color: '#22C55E' },
    { name: 'Расходы', value: expense, color: '#EF4444' },
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          return (
          <div className="bg-card-hover text-text-primary p-3 rounded-lg border border-border-primary">
              <p className="font-bold">{label}</p>
              <p style={{ color: payload[0].payload.color }}>
              {`Сумма: ${formatCurrency(payload[0].value)}`}
              </p>
          </div>
          );
      }
      return null;
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart 
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
        }}
        barGap={50}
      >
        <XAxis dataKey="name" tick={{ fill: 'rgb(var(--color-text-secondary))' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fill: 'rgb(var(--color-text-secondary))' }} axisLine={false} tickLine={false} width={100}/>
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgb(var(--color-card-hover))'}}/>
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpenseBarChart;