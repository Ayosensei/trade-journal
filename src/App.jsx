import React, { useState } from 'react';
import { TradeProvider, useTradeContext } from './context/TradeContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import DailyJournal from './pages/DailyJournal';
import TradeLog from './pages/TradeLog';
import Analysis from './pages/Analysis';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import TradeForm from './components/trades/TradeForm';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const { selectedAccount, accounts, switchAccount } = useTradeContext();

  const handleAddTrade = () => {
    setIsTradeFormOpen(true);
  };

  const handleAccountChange = (accountId) => {
    switchAccount(accountId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'daily-journal':
        return <DailyJournal />;
      case 'trade-log':
        return <TradeLog />;
      case 'insights':
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Insights</h2>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          </div>
        );
      case 'analysis':
        return <Analysis />;
      case 'trading-lab':
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Trading Lab</h2>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          </div>
        );
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onAddTrade={handleAddTrade}
        selectedAccount={selectedAccount}
        accounts={accounts}
        onAccountChange={handleAccountChange}
      />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />

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
