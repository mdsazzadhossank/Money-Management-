import React from 'react';
import { PortfolioStats } from '../types';
import { Wallet, TrendingUp, DollarSign, PiggyBank } from 'lucide-react';

interface DashboardStatsProps {
  stats: PortfolioStats;
}

const StatCard: React.FC<{ title: string; value: string; subValue?: string; icon: React.ReactNode; colorClass: string }> = ({ 
  title, value, subValue, icon, colorClass 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass} text-white`}>
      {icon}
    </div>
  </div>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Realized Profit" 
        value={`${stats.totalRealizedProfit >= 0 ? '+' : ''}${stats.totalRealizedProfit.toLocaleString()} BDT`}
        subValue="Lifetime earnings from sales"
        icon={<TrendingUp size={24} />}
        colorClass={stats.totalRealizedProfit >= 0 ? "bg-emerald-500" : "bg-rose-500"}
      />
      
      <StatCard 
        title="USD Inventory" 
        value={`$${stats.currentInventoryUSD.toLocaleString()}`}
        subValue="Current dollars on hand"
        icon={<DollarSign size={24} />}
        colorClass="bg-blue-500"
      />

      <StatCard 
        title="Avg Buy Cost" 
        value={`${stats.weightedAvgCost.toFixed(2)} BDT`}
        subValue="Break-even rate for sales"
        icon={<Wallet size={24} />}
        colorClass="bg-amber-500"
      />

      <StatCard 
        title="Portfolio Value (Cost)" 
        value={`${stats.totalInvested.toLocaleString()} BDT`}
        subValue="Total capital currently locked"
        icon={<PiggyBank size={24} />}
        colorClass="bg-slate-500"
      />
    </div>
  );
};

export default DashboardStats;