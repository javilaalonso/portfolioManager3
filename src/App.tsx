import React, { useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { TabNavigation } from './components/TabNavigation';
import { PortfolioSummary } from './components/PortfolioSummary';
import { StockList } from './components/StockList';
import { AddTransactionForm } from './components/AddTransactionForm';
import { TransactionList } from './components/TransactionList';
import { useTabStore } from './store/tabStore';
import { useTransactionStore } from './store/transactionStore';
import { usePortfolioStore } from './store/portfolioStore';

function App() {
  const activeTab = useTabStore((state) => state.activeTab);
  const initializeTransactions = useTransactionStore((state) => state.initializeTransactions);
  const updateStockPrices = usePortfolioStore((state) => state.updateStockPrices);

  useEffect(() => {
    const initialize = async () => {
      await initializeTransactions();
      await updateStockPrices();
    };
    initialize();
  }, [initializeTransactions, updateStockPrices]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Stock Portfolio Manager</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation />
        
        {activeTab === 'portfolio' ? (
          <>
            <div className="mt-6">
              <PortfolioSummary />
            </div>
            <div className="mt-6">
              <StockList />
            </div>
          </>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6">
            <AddTransactionForm />
            <TransactionList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;