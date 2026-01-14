import { GoogleGenAI } from "@google/genai";
import { Transaction, PortfolioStats } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeTradeHistory = async (
  transactions: Transaction[], 
  stats: PortfolioStats
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API Key configuration error. Please check your settings.";

  const prompt = `
    Act as a financial advisor for a currency trader in Bangladesh.
    
    Here is the user's trading data:
    - Current USD Inventory: $${stats.currentInventoryUSD.toFixed(2)}
    - Weighted Average Cost per USD: ${stats.weightedAvgCost.toFixed(2)} BDT
    - Total Realized Profit: ${stats.totalRealizedProfit.toFixed(2)} BDT
    - Total Transaction Count: ${transactions.length}

    Recent Transactions (Last 5):
    ${transactions.slice(0, 5).map(t => `- ${t.type} $${t.amountUSD} @ ${t.rate} (Profit: ${t.profit ? t.profit.toFixed(2) : 'N/A'})`).join('\n')}

    Please provide a brief, encouraging analysis in **Bengali** (বাংলা) explaining their profit situation and a quick tip for future trades based on the average cost. Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Analysis failed due to a technical issue. Please try again later.";
  }
};