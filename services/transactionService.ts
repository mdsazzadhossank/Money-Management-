import { Transaction } from '../types';

// ⚠️ গুরত্বপূর্ণ: আপনি যদি লোকাল কম্পিউটারে (npm run dev) কাজ করেন, তাহলে এখানে api.php এর পুরো লিংক দিতে হবে।
// উদাহরণ: 'http://localhost/dollar-tracker/api.php' অথবা 'https://yourdomain.com/api.php'
// আর যদি হোস্টিংয়ে আপলোড করে থাকেন, তাহলে শুধু 'api.php' রাখলেই চলবে।

const API_URL = 'http://localhost/your_folder_name/api.php'; // 👈 এখানে আপনার সঠিক URL টি বসান

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      console.log(`Fetching from: ${API_URL}`);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        const text = await response.text();
        console.error("API Error (GetAll):", response.status, text);
        throw new Error(`Server returned status: ${response.status}`);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data.map((t: any) => ({
          ...t,
          amountUSD: Number(t.amountUSD),
          rate: Number(t.rate),
          totalLocal: Number(t.totalLocal),
          profit: t.profit !== null ? Number(t.profit) : undefined,
          costBasisAtTime: t.costBasisAtTime !== null ? Number(t.costBasisAtTime) : undefined
        })) : [];
      } catch (e) {
        console.error("Invalid JSON response:", text);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  },

  async save(transaction: Transaction): Promise<boolean> {
    try {
      console.log(`Saving to: ${API_URL}`, transaction);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("API Error (Save):", response.status, text);
        alert(`Error: Server returned ${response.status}. Check console for details.`);
        return false;
      }

      const result = await response.json();
      console.log("Save success:", result);
      return true;
    } catch (error) {
      console.error("Network Failed to save transaction:", error);
      alert("Network Error: Could not connect to API. Check if the URL is correct in transactionService.ts");
      return false;
    }
  }
};