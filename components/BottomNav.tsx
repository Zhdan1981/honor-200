
import React from 'react';
import { Wallet, List, PieChart } from 'lucide-react';

type Tab = 'budget' | 'history' | 'charts';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems = [
  { id: 'budget', label: 'Бюджет', icon: Wallet },
  { id: 'history', label: 'История', icon: List },
  { id: 'charts', label: 'Графики', icon: PieChart },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-gray-100/80 dark:bg-black/50 border-t border-gray-300 dark:border-gray-800 backdrop-blur-md">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Tab)}
              className="flex flex-col items-center justify-center w-full h-full text-gray-500"
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNav;