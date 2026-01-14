import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, PortfolioStats } from './types';
import DashboardStats from './components/DashboardStats';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ChartSection from './components/ChartSection';
import { analyzeTradeHistory } from './services/geminiService';
import { transactionService } from './services/transactionService';
import { BrainCircuit, Loader2, Database } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<PortfolioStats>({
    currentInventoryUSD: 0,
    weightedAvgCost: 0,
    totalRealizedProfit: 0,
    totalInvested: 0,
    totalSales: 0
  });

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load data from MySQL on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await transactionService.getAll();
      setTransactions(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Recalculate stats whenever transactions change
  useEffect(() => {
    let inventory = 0;
    let totalRealizedProfit = 0;
    let currentTotalCost = 0; // Total cost of currently held USD
    let totalSales = 0;

    // We must process transactions chronologically to get accurate Weighted Average Cost
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTransactions.forEach(t => {
      if (t.type === 'BUY') {
        const newCost = t.amountUSD * t.rate;
        currentTotalCost += newCost;
        inventory += t.amountUSD;
      } else if (t.type === 'SELL') {
        const avgCostAtSale = currentTotalCost / inventory || 0; 
        const cogs = t.amountUSD * avgCostAtSale;
        
        inventory -= t.amountUSD;
        currentTotalCost -= cogs;

        if (t.profit !== undefined) {
          totalRealizedProfit += t.profit;
        }
        totalSales += t.totalLocal;
      }
    });

    const weightedAvgCost = inventory > 0 ? currentTotalCost / inventory : 0;

    setStats({
      currentInventoryUSD: inventory,
      weightedAvgCost: weightedAvgCost,
      totalRealizedProfit: totalRealizedProfit,
      totalInvested: currentTotalCost,
      totalSales
    });
  }, [transactions]);

  const handleAddTransaction = async (type: TransactionType, amount: number, rate: number) => {
    const newTx: Transaction = {
      id: Date.now().toString(), // We generate ID on client for simplicity, or let DB handle it
      date: new Date().toISOString(),
      type,
      amountUSD: amount,
      rate: rate,
      totalLocal: amount * rate,
    };

    if (type === 'SELL') {
      const profitPerUnit = rate - stats.weightedAvgCost;
      newTx.profit = profitPerUnit * amount;
      newTx.costBasisAtTime = stats.weightedAvgCost;
    }

    // Optimistic Update
    setTransactions(prev => [...prev, newTx]);
    setAiAnalysis(null);

    // Save to Database
    const saved = await transactionService.save(newTx);
    if (!saved) {
      alert("⚠️ Warning: Could not save to database. Check your internet connection or server configuration.");
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeTradeHistory(transactions, stats);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BrainCircuit size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
              Dollar Trade Tracker
            </h1>
          </div>
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing || transactions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
            {isAnalyzing ? 'Analyzing...' : 'AI Insights (বাংলা)'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p>Connecting to Database...</p>
          </div>
        ) : (
          <>
            {/* AI Analysis Result */}
            {aiAnalysis && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100 rounded-xl animate-fade-in relative">
                <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                  <BrainCircuit size={18} /> 
                  AI Advisor
                </h3>
                <p className="text-slate-800 whitespace-pre-line leading-relaxed">{aiAnalysis}</p>
                <button 
                  onClick={() => setAiAnalysis(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Top Stats */}
            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form & Chart */}
              <div className="lg:col-span-1 space-y-8">
                <TransactionForm 
                  onAddTransaction={handleAddTransaction} 
                  currentInventory={stats.currentInventoryUSD}
                />
                <ChartSection transactions={transactions} />
              </div>

              {/* Right Column: History */}
              <div className="lg:col-span-2 h-[600px]">
                <TransactionList transactions={transactions} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;