import { MarketDataProvider, StockQuote, SearchResult, ApiError } from './marketData/types';
import { getMarketDataProvider } from './marketData';

const provider = getMarketDataProvider();

export type { StockQuote, SearchResult, ApiError, MarketDataProvider };

export const searchSymbols = (query: string): Promise<SearchResult[] | ApiError> => {
  return provider.searchSymbols(query);
};

export const getStockQuote = (symbol: string): Promise<StockQuote | ApiError> => {
  return provider.getStockQuote(symbol);
};

export { getMarketDataProvider };