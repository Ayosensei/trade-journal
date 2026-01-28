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
    { id: 'daily-journal', label: 'Journal', icon: BookOpen },
    { id: 'trade-log', label: 'Trade Log', icon: List },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
  ];

  const secondaryTabs = [
    { id: 'trading-lab', label: 'Lab', icon: FlaskConical },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const TabButton = ({ tab, isActive }) => {
    const Icon = tab.icon;
    return (
      <button
        onClick={() => onTabChange(tab.id)}
        className={`nav-item flex items-center gap-2 whitespace-nowrap ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
      >
        <Icon size={16} />
        <span className="text-sm">{tab.label}</span>
      </button>
    );
  };

  return (
    <nav className="border-b sticky top-[72px] md:top-[72px] z-40" style={{ borderColor: 'var(--border-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex items-center flex-shrink-0">
            {mainTabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
            ))}
          </div>
          
          <div className="h-6 w-px mx-2 flex-shrink-0" style={{ backgroundColor: 'var(--border-secondary)' }}></div>

          <div className="flex items-center flex-shrink-0">
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
