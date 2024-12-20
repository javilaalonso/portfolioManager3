import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';

export function AddStockForm() {
  const addStock = usePortfolioStore((state) => state.addStock);
  const [formData, setFormData] = useState({
    symbol: '',
    shares: '',
    purchasePrice: '',
    purchaseDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStock({
      symbol: formData.symbol.toUpperCase(),
      shares: Number(formData.shares),
      purchasePrice: Number(formData.purchasePrice),
      purchaseDate: new Date(formData.purchaseDate),
    });
    setFormData({ symbol: '', shares: '', purchasePrice: '', purchaseDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Symbol</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
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
          <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Stock
      </button>
    </form>
  );
}