export type TransactionType = 'BUY' | 'SELL';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amountUSD: number;     // Amount of Dollars
  rate: number;          // Rate in Local Currency (e.g., BDT)
  totalLocal: number;    // Total Value in Local Currency
  profit?: number;       // Only applicable for SELL transactions
  costBasisAtTime?: number; // Snapshot of avg cost when sold
}

export interface PortfolioStats {
  currentInventoryUSD: number;
  weightedAvgCost: number;
  totalRealizedProfit: number;
  totalInvested: number; // Current value locked in USD at cost
  totalSales: number;
}