import React, { useState } from 'react';
import { TradeProvider, useTradeContext } from './context/TradeContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import TradeForm from './components/trades/TradeForm';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const { selectedAccount, accounts, switchAccount } = useTradeContext();

  const handleAddTrade = () => {
    setIsTradeFormOpen(true);
  };

  const handleAddDailyEntry = () => {
    // Placeholder for daily entry functionality
    console.log('Add daily entry clicked');
  };

  const handleAccountChange = (accountId) => {
    switchAccount(accountId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header
        onAddTrade={handleAddTrade}
        onAddDailyEntry={handleAddDailyEntry}
        selectedAccount={selectedAccount}
        accounts={accounts}
        onAccountChange={handleAccountChange}
      />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'daily-journal' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Daily Journal</h2>
              <p className="text-[#888888]">Coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === 'trade-log' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Trade Log</h2>
              <p className="text-[#888888]">Coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === 'insights' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Insights</h2>
              <p className="text-[#888888]">Coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Analysis</h2>
              <p className="text-[#888888]">Coming soon...</p>
            </div>
          </div>
        )}
      </main>

      <TradeForm
        isOpen={isTradeFormOpen}
        onClose={() => setIsTradeFormOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <TradeProvider>
      <AppContent />
    </TradeProvider>
  );
}

export default App;

