import React from 'react';
import { 
  DollarSign, 
  Target, 
  Repeat, 
  TrendingUp, 
  TrendingDown,
  BarChart3 
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
          label="Average Win"
          value={formatCurrency(avgWin)}
          type="positive"
        />
        <MetricCard
          icon={TrendingDown}
          label="Average Loss"
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
      <div className="mb-8">
        <EquityChart data={equityData} currentPnL={netPnL} />
      </div>

      {/* Trading Rules Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-xl">⚡</div>
          <h3 className="text-lg font-semibold text-white">Trading Rules</h3>
        </div>
        
        <div className="flex gap-4 border-b border-[#333333] mb-4 overflow-x-auto scrollbar-hide">
          <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-[#d4ff00]">
            Before
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#888888] hover:text-white">
            During
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#888888] hover:text-white">
            After
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-[#888888]">Ensure that weekly analysis is done</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-[#888888]">Check market conditions and news</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-[#888888]">Review trading plan and strategy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
