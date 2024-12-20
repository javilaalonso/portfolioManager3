import React, { useRef } from 'react';
import { Trash2, Download, Upload } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportTransactionsToCSV, parseTransactionsCSV } from '../utils/csvUtils';

export function TransactionList() {
  const { transactions, removeTransaction, addBulkTransactions } = useTransactionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsedTransactions = await parseTransactionsCSV(file);
      await addBulkTransactions(parsedTransactions);
      event.target.value = ''; // Reset file input
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import transactions');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-4 mb-4">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button
          onClick={handleImportClick}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </button>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(transaction.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{transaction.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{transaction.shares}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(transaction.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {formatCurrency(transaction.shares * transaction.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => removeTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}