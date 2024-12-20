import { create } from 'zustand';
import { Stock, StockPosition } from '../types/stock';
import { getMarketDataProvider } from '../services/marketData';
import { useTransactionStore } from './transactionStore';

const marketDataProvider = getMarketDataProvider();

interface PortfolioState {
  currentPrices: { [symbol: string]: number };
  apiErrors: { [symbol: string]: any };
  getPositions: () => StockPosition[];
  updateStockPrices: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  currentPrices: {},
  apiErrors: {},
  isLoading: false,
  error: null,
  lastUpdated: null,

  updateStockPrices: async () => {
    set({ isLoading: true, error: null, apiErrors: {} });
    try {
      const positions = get().getPositions();
      const symbols = [...new Set(positions.map(p => p.symbol))];
      
      if (symbols.length === 0) {
        set({ isLoading: false });
        return;
      }

      const updatedPrices: { [symbol: string]: number } = {};
      const newApiErrors: { [symbol: string]: any } = {};

      await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const result = await marketDataProvider.getStockQuote(symbol);
            if ('price' in result) {
              updatedPrices[symbol] = result.price;
            } else {
              newApiErrors[symbol] = result;
              // Keep existing price if available
              if (get().currentPrices[symbol]) {
                updatedPrices[symbol] = get().currentPrices[symbol];
              }
            }
          } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            newApiErrors[symbol] = { message: 'Failed to fetch price', details: error };
          }
        })
      );

      set({ 
        currentPrices: updatedPrices,
        apiErrors: newApiErrors,
        lastUpdated: new Date(),
        error: Object.keys(newApiErrors).length > 0 ? 'Some stock quotes failed to update' : null
      });
    } catch (error) {
      console.error('Failed to update stock prices:', error);
      set({ error: 'Failed to update stock prices' });
    } finally {
      set({ isLoading: false });
    }
  },

  getPositions: () => {
    const transactions = useTransactionStore.getState().transactions;
    const currentPrices = get().currentPrices;
    const positionsMap: { [symbol: string]: StockPosition } = {};

    // Sort transactions by date to process them chronologically
    const sortedTransactions = [...transactions].sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );

    sortedTransactions.forEach(transaction => {
      const { symbol, shares, price, type, date } = transaction;
      
      if (!positionsMap[symbol]) {
        positionsMap[symbol] = {
          symbol,
          shares: 0,
          purchasePrice: 0,
          purchaseDate: date,
          currentPrice: currentPrices[symbol] || price,
          totalValue: 0,
          totalReturn: 0,
          totalReturnPercentage: 0
        };
      }

      const position = positionsMap[symbol];
      
      if (type === 'buy') {
        const newTotalShares = position.shares + shares;
        const newTotalCost = (position.shares * position.purchasePrice) + (shares * price);
        position.purchasePrice = newTotalCost / newTotalShares;
        position.shares = newTotalShares;
        if (!position.purchaseDate || date < position.purchaseDate) {
          position.purchaseDate = date;
        }
      } else { // sell
        position.shares -= shares;
      }

      // Update position calculations
      if (position.shares <= 0) {
        delete positionsMap[symbol];
      } else {
        position.currentPrice = currentPrices[symbol] || price;
        position.totalValue = position.shares * position.currentPrice;
        const totalCost = position.shares * position.purchasePrice;
        position.totalReturn = position.totalValue - totalCost;
        position.totalReturnPercentage = (totalCost > 0) ? (position.totalReturn / totalCost) * 100 : 0;
      }
    });

    return Object.values(positionsMap);
  },
}));