import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { TransactionFormData } from '../types/transaction';
import { searchSymbols, SearchResult } from '../services/stockApi';
import { useDebounce } from '../hooks/useDebounce';

export function AddTransactionForm() {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateStockPrices = usePortfolioStore((state) => state.updateStockPrices);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'buy',
    symbol: '',
    shares: '',
    price: '',
    date: '',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.length < 1) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const results = await searchSymbols(debouncedSearchQuery);
        if ('message' in results) {
          setSearchError(results.message);
          setSearchResults([]);
        } else {
          setSearchResults(results);
          setShowDropdown(true);
        }
      } catch (error) {
        setSearchError('Failed to search symbols');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        id: Date.now().toString(),
        type: formData.type as 'buy' | 'sell',
        symbol: formData.symbol.toUpperCase(),
        shares: Number(formData.shares),
        price: Number(formData.price),
        date: new Date(formData.date),
      });
      
      // Update stock prices after adding a transaction
      await updateStockPrices();
      
      // Reset form
      setFormData({ type: 'buy', symbol: '', shares: '', price: '', date: '' });
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const handleSymbolSelect = (result: SearchResult) => {
    setFormData({ ...formData, symbol: result.symbol });
    setSearchQuery(`${result.symbol} - ${result.name}`);
    setShowDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'buy' | 'sell' })}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Symbol</label>
          <div className="relative">
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {searchResults.map((result) => (
                  <li
                    key={result.symbol}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                    onClick={() => handleSymbolSelect(result)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium block truncate">{result.symbol}</span>
                      <span className="text-gray-500 ml-2 block truncate">{result.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{result.region}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {searchError && (
            <p className="mt-1 text-sm text-red-600">{searchError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Shares</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.shares}
            onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Transaction
      </button>
    </form>
  );
}