import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  List, 
  TrendingUp, 
  BarChart3,
  FlaskConical,
  Target,
  Settings
} from 'lucide-react';

const Navigation = ({ activeTab = 'dashboard', onTabChange }) => {
  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily-journal', label: 'Daily Journal', icon: BookOpen },
    { id: 'trade-log', label: 'Trade Log', icon: List },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
  ];

  const secondaryTabs = [
    { id: 'trading-lab', label: 'Trading Lab', icon: FlaskConical },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={() => onTabChange(tab.id)}
        className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} flex items-center gap-2`}
      >
        <Icon size={18} />
        <span>{tab.label}</span>
      </button>
    );
  };

  return (
    <nav className="border-b border-[#333333] bg-[#0a0a0a] sticky top-[100px] z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            {mainTabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {secondaryTabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
