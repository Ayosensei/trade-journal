import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ onAddTrade, onAddDailyEntry, selectedAccount, accounts, onAccountChange }) => {
  return (
    <header className="border-b border-[#333333] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Trade Journal</h1>
            <p className="text-sm text-[#888888] mt-1">
              Track your trades, Analyze your performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Account Selector */}
            {accounts && accounts.length > 0 && (
              <div className="relative">
                <select
                  value={selectedAccount?.id || ''}
                  onChange={(e) => onAccountChange(e.target.value)}
                  className="select pr-10 appearance-none"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={16} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" 
                />
              </div>
            )}
            
            <Button onClick={onAddDailyEntry} variant="secondary" icon={Plus}>
              Add Daily Entry
            </Button>
            <Button onClick={onAddTrade} variant="primary" icon={Plus}>
              Add Trade
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
