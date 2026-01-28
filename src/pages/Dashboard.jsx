import React from 'react';
import { 
  DollarSign, 
  Target, 
  Repeat, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import AccountCard from '../components/dashboard/AccountCard';
import EquityChart from '../components/dashboard/EquityChart';
import { useTradeContext } from '../context/TradeContext';
import {
  calculateNetPnL,
  calculateWinRate,
  calculateAverageRR,
  calculateAverageWin,
  calculateAverageLoss,
  getEquityCurveData,
  formatCurrency,
} from '../utils/calculations';

const Dashboard = () => {
  const { selectedAccount, getAccountTrades, accounts, switchAccount } = useTradeContext();
  const trades = getAccountTrades();

  // Calculate metrics
  const netPnL = calculateNetPnL(trades);
  const winRate = calculateWinRate(trades);
  const avgRR = calculateAverageRR(trades);
  const avgWin = calculateAverageWin(trades);
  const avgLoss = calculateAverageLoss(trades);
  const totalTrades = trades.length;

  // Get equity curve data
  const equityData = getEquityCurveData(trades, selectedAccount?.initialBalance || 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            isActive={account.id === selectedAccount?.id}
            onClick={() => switchAccount(account.id)}
          />
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <MetricCard
          icon={DollarSign}
          label="Net P/L"
          value={formatCurrency(netPnL)}
          type={netPnL >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          icon={Target}
          label="Win Rate"
          value={`${winRate}%`}
          subtitle={`${trades.filter(t => t.outcome === 'Win').length}/${totalTrades}`}
          type="neutral"
        />
        <MetricCard
          icon={Repeat}
          label="Avg R:R"
          value={`${avgRR}R`}
          type="neutral"
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg Win"
          value={formatCurrency(avgWin)}
          type="positive"
        />
        <MetricCard
          icon={TrendingDown}
          label="Avg Loss"
          value={formatCurrency(avgLoss)}
          type="negative"
        />
        <MetricCard
          icon={BarChart3}
          label="Total Trades"
          value={totalTrades}
          type="neutral"
        />
      </div>

      {/* Equity Chart */}
      <div className="mb-6">
        <EquityChart data={equityData} currentPnL={netPnL} />
      </div>

      {/* Trading Rules Section */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Trading Checklist</h3>
        </div>
        
        <div className="flex gap-4 border-b mb-4 overflow-x-auto scrollbar-hide" style={{ borderColor: 'var(--border-secondary)' }}>
          <button className="px-3 py-2 text-xs font-medium border-b-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--accent-primary)' }}>
            Before Trade
          </button>
          <button className="px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            During Trade
          </button>
          <button className="px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            After Trade
          </button>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Ensure that weekly analysis is done</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Check market conditions and news</span>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Review trading plan and strategy</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
