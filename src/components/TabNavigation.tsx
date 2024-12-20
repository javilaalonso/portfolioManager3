import React from 'react';
import { LineChart, LayoutDashboard } from 'lucide-react';
import { useTabStore } from '../store/tabStore';
import { TabId } from '../types/tabs';

export function TabNavigation() {
  const { activeTab, setActiveTab } = useTabStore();

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'portfolio', label: 'Portfolio', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'analytics', label: 'Transactions', icon: <LineChart className="w-5 h-5" /> },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
            `}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}