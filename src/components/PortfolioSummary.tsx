import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import { formatCurrency } from '../utils/formatters';

export function PortfolioSummary() {
  const positions = usePortfolioStore((state) => state.getPositions());
  
  const totalValue = positions.reduce((sum, position) => 
    sum + (position.shares * position.currentPrice), 0);
  
  const totalCost = positions.reduce((sum, position) => 
    sum + (position.shares * position.purchasePrice), 0);
  
  const totalReturn = totalValue - totalCost;
  const totalReturnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalValue)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Positions</p>
            <p className="text-2xl font-semibold text-gray-900">{positions.length}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Performance</p>
            <p className={`text-2xl font-semibold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturnPercentage.toFixed(2)}%
            </p>
          </div>
          {totalReturn >= 0 ? (
            <TrendingUp className="w-8 h-8 text-green-500" />
          ) : (
            <TrendingDown className="w-8 h-8 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
}