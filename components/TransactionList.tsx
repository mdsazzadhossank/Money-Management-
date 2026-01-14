import React from 'react';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Recent History</h2>
      </div>
      <div className="overflow-y-auto flex-1 p-0">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <p>No transactions yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice().reverse().map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.type === 'BUY' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.type === 'BUY' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    ${t.amountUSD.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {t.rate.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                    t.profit && t.profit > 0 ? 'text-emerald-600' : 
                    t.profit && t.profit < 0 ? 'text-rose-600' : 'text-slate-300'
                  }`}>
                    {t.type === 'SELL' ? `${t.profit && t.profit > 0 ? '+' : ''}${t.profit?.toLocaleString()} BDT` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;