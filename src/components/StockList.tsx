import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';

export function StockList() {
  const { positions, updateStockPrices, isLoading, error, lastUpdated, apiErrors } = usePortfolioStore((state) => ({
    positions: state.getPositions(),
    updateStockPrices: state.updateStockPrices,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    apiErrors: state.apiErrors,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Positions</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(lastUpdated)}
            </p>
          )}
        </div>
        <button
          onClick={() => updateStockPrices()}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Prices
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              {Object.entries(apiErrors).map(([symbol, error]) => (
                <div key={symbol} className="mt-2 text-sm text-red-700">
                  <strong>{symbol}:</strong> {error.message}
                  <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto">
                    {JSON.stringify(error.details, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acquisition Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {positions.map((position) => (
              <tr key={position.symbol}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {position.symbol}
                  {apiErrors[position.symbol] && (
                    <AlertCircle className="inline-block ml-2 h-4 w-4 text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{position.shares}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(position.purchasePrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(position.currentPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(position.totalValue)}</td>
                <td className={`px-6 py-4 whitespace-nowrap font-medium ${position.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(position.totalReturnPercentage)}
                  <br />
                  <span className="text-sm">({formatCurrency(position.totalReturn)})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}