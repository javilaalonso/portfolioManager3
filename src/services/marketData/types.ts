export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

export interface ApiError {
  message: string;
  details: any;
}

export interface MarketDataProvider {
  searchSymbols: (query: string) => Promise<SearchResult[] | ApiError>;
  getStockQuote: (symbol: string) => Promise<StockQuote | ApiError>;
}