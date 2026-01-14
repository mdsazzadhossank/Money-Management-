import React from 'react';
import { Transaction } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

interface ChartSectionProps {
  transactions: Transaction[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ transactions }) => {
  // Process data for the chart: Only show SELL transactions to visualize profit/loss
  const profitData = transactions
    .filter(t => t.type === 'SELL')
    .map(t => ({
      date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      profit: t.profit || 0,
      amount: t.amountUSD
    }))
    .slice(-10); // Last 10 sales

  if (profitData.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Realized Profit History (Last 10 Sales)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={profitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <ReferenceLine y={0} stroke="#94a3b8" />
          <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
            {profitData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#f43f5e'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;