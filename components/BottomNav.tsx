import React from 'react';
import { Wallet, List, BarChart2 } from 'lucide-react';

type Tab = 'budget' | 'history' | 'charts';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  opacity: number;
}

const navItems = [
  { id: 'budget', label: 'Бюджет', icon: Wallet },
  { id: 'history', label: 'История', icon: List },
  { id: 'charts', label: 'Графики', icon: BarChart2 },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, opacity }) => {
  return (
    <footer 
        className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-nav-bg border-t border-border-primary backdrop-blur-md"
        style={{ '--tw-bg-opacity': opacity / 100 } as React.CSSProperties}
    >
      <div className="h-16 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Tab)}
              className="flex flex-col items-center justify-center flex-1 h-full text-nav-inactive"
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-nav-active' : ''}`} />
              <span className={`text-xs ${isActive ? 'text-nav-active' : ''}`}>
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