import { create } from 'zustand';
import { TabId } from '../types/tabs';

interface TabState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'portfolio',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));