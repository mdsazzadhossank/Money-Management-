import React, { useState } from 'react';
import { TransactionType } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (type: TransactionType, amount: number, rate: number) => void;
  currentInventory: number;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, currentInventory }) => {
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [type, setType] = useState<TransactionType>('BUY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    const numRate = parseFloat(rate);

    if (numAmount > 0 && numRate > 0) {
      if (type === 'SELL' && numAmount > currentInventory) {
        alert("Not enough USD inventory to sell this amount!");
        return;
      }
      onAddTransaction(type, numAmount, numRate);
      setAmount('');
      setRate('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle size={20} className="text-blue-600" />
        New Transaction
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setType('BUY')}
            className={`py-2 px-4 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              type === 'BUY' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <PlusCircle size={16} /> Buy USD
          </button>
          <button
            type="button"
            onClick={() => setType('SELL')}
            className={`py-2 px-4 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              type === 'SELL' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MinusCircle size={16} /> Sell USD
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">$</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Exchange Rate (BDT/USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 120.50"
            required
          />
        </div>

        <div className="pt-2">
           <div className="flex justify-between text-sm text-slate-500 mb-2">
             <span>Total Value:</span>
             <span className="font-medium text-slate-800">
               {amount && rate ? (parseFloat(amount) * parseFloat(rate)).toLocaleString() : '0'} BDT
             </span>
           </div>
           
           <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all transform hover:scale-[1.02] ${
              type === 'BUY' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {type === 'BUY' ? 'Confirm Purchase' : 'Confirm Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;