import { Transaction } from '../types';

const API_URL = 'api.php';

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Ensure numeric values are actually numbers (PHP might return strings)
      return Array.isArray(data) ? data.map((t: any) => ({
        ...t,
        amountUSD: Number(t.amountUSD),
        rate: Number(t.rate),
        totalLocal: Number(t.totalLocal),
        profit: t.profit !== null ? Number(t.profit) : undefined,
        costBasisAtTime: t.costBasisAtTime !== null ? Number(t.costBasisAtTime) : undefined
      })) : [];
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  },

  async save(transaction: Transaction): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      return response.ok;
    } catch (error) {
      console.error("Failed to save transaction:", error);
      return false;
    }
  }
};