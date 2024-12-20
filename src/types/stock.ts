export interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice: number;
}

export interface StockPosition extends Stock {
  totalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
}