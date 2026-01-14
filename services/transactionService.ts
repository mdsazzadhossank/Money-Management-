import { Transaction } from '../types';

// ⚠️ আপনার স্ক্রিনশট অনুযায়ী লাইভ সার্ভারের লিংক দেওয়া হলো
const API_URL = 'https://devkazi.cloud/api.php';

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      console.log(`Fetching from: ${API_URL}`);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        const text = await response.text();
        console.error("API Error (GetAll):", response.status, text);
        // 500 এরর হ্যান্ডেল করা যাতে অ্যাপ ক্র্যাশ না করে
        return []; 
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

      // রেসপন্স টেক্সট আগে নিয়ে নিচ্ছি ডিবাগিংয়ের জন্য
      const responseText = await response.text();

      if (!response.ok) {
        console.error("API Error (Save):", response.status, responseText);
        alert(`Server Error (${response.status}): ${responseText.substring(0, 100)}`);
        return false;
      }

      try {
        const result = JSON.parse(responseText);
        console.log("Save success:", result);
        return true;
      } catch (e) {
        console.error("Non-JSON response from server:", responseText);
        return true; // অনেক সময় পিএইচপি ওয়ার্নিং দিলেও ডাটা সেভ হয়
      }
    } catch (error) {
      console.error("Network Failed to save transaction:", error);
      alert("Network Error: Could not connect to API.");
      return false;
    }
  }
};