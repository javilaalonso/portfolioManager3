export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  type: TransactionType;
  symbol: string;
  shares: number;
  price: number;
  date: Date;
}

export interface TransactionFormData {
  type: TransactionType;
  symbol: string;
  shares: string;
  price: string;
  date: string;
}