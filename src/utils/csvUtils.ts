import Papa from 'papaparse';
import { Transaction } from '../types/transaction';

export const CSV_HEADERS = ['Type', 'Symbol', 'Shares', 'Price', 'Date'];

export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const data = transactions.map(transaction => ({
    Type: transaction.type,
    Symbol: transaction.symbol,
    Shares: transaction.shares,
    Price: transaction.price,
    Date: transaction.date.toISOString().split('T')[0]
  }));

  const csv = Papa.unparse({
    fields: CSV_HEADERS,
    data: data,
    delimiter: ";"
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseTransactionsCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions: Transaction[] = results.data.map((row: any) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: row.Type.toLowerCase() as 'buy' | 'sell',
            symbol: row.Symbol.toUpperCase(),
            shares: Number(row.Shares),
            price: Number(row.Price),
            date: new Date(row.Date)
          }));
          resolve(transactions);
        } catch (error) {
          reject(new Error('Invalid CSV format. Please check the file structure.'));
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
}