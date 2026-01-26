import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ onAddTrade, selectedAccount, accounts, onAccountChange }) => {
  return (
    <header className="border-b border-white/10 glassmorphism sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Trade Journal</h1>
            <p className="text-sm text-gray-400 mt-1">
              Track your trades, Analyze your performance
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Account Selector */}
            {accounts && accounts.length > 0 && (
              <div className="relative flex-1 md:flex-none">
                <select
                  value={selectedAccount?.id || ''}
                  onChange={(e) => onAccountChange(e.target.value)}
                  className="select pr-10 appearance-none w-full"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={16} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
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
