import React from 'react';
import { Plus, ChevronDown, BarChart2 } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ onAddTrade, selectedAccount, accounts, onAccountChange }) => {
  return (
    <header className="border-b sticky top-0 z-50" style={{ borderColor: 'var(--border-secondary)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <BarChart2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>TradeJournal</h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Track • Analyze • Improve
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Account Selector */}
            {accounts && accounts.length > 0 && (
              <div className="relative flex-1 md:flex-none">
                <select
                  value={selectedAccount?.id || ''}
                  onChange={(e) => onAccountChange(e.target.value)}
                  className="select pr-10 appearance-none w-full md:w-48"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={16} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
            )}
            
            <Button onClick={onAddTrade} variant="primary" icon={Plus} className="flex-1 md:flex-none justify-center">
              Add Trade
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
