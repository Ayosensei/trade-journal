import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Clock, DollarSign, Target, Zap, Activity } from 'lucide-react';
import { useTradeContext } from '../context/TradeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  calculateCurrentStreak,
  calculateProfitFactor,
  calculateExpectancy,
  calculateMaxDrawdown,
  getMonthlyPerformance,
  getWeekdayDistribution,
} from '../utils/calculations';

const Analysis = () => {
  const { getAccountTrades, selectedAccount } = useTradeContext();
  const trades = getAccountTrades();

  // Calculate analytics
  const pairPerformance = trades.reduce((acc, trade) => {
    const pair = trade.pair || 'Unknown';
    if (!acc[pair]) {
      acc[pair] = { pair, wins: 0, losses: 0, totalPnL: 0, count: 0 };
    }
    acc[pair].count++;
    acc[pair].totalPnL += trade.pnl || 0;
    if (trade.outcome === 'Win') acc[pair].wins++;
    else acc[pair].losses++;
    return acc;
  }, {});

  const pairData = Object.values(pairPerformance).map(p => ({
    ...p,
    winRate: p.count > 0 ? ((p.wins / p.count) * 100).toFixed(1) : 0,
  }));

  // Time-based performance
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    trades: 0,
    profit: 0,
  }));

  trades.forEach(trade => {
    const hour = new Date(trade.date).getHours();
    hourlyData[hour].trades++;
    hourlyData[hour].profit += trade.pnl || 0;
  });

  const activeHours = hourlyData.filter(h => h.trades > 0);

  // Advanced metrics
  const streak = calculateCurrentStreak(trades);
  const profitFactor = calculateProfitFactor(trades);
  const expectancy = calculateExpectancy(trades);
  const maxDrawdown = calculateMaxDrawdown(trades, selectedAccount?.initialBalance || 0);
  const monthlyPerformance = getMonthlyPerformance(trades);
  const weekdayDistribution = getWeekdayDistribution(trades);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Advanced Analysis</h2>
        <p className="text-gray-400">Deep dive into your trading patterns and performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-white" size={20} />
            <span className="text-gray-400 text-sm">Total Trades</span>
          </div>
          <p className="text-2xl font-bold text-white">{trades.length}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-white" size={20} />
            <span className="text-gray-400 text-sm">Best Pair</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {pairData.length > 0 ? pairData.sort((a, b) => b.totalPnL - a.totalPnL)[0].pair : 'N/A'}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-white" size={20} />
            <span className="text-gray-400 text-sm">Most Active Hour</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {activeHours.length > 0 ? activeHours.sort((a, b) => b.trades - a.trades)[0].hour : 'N/A'}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-white" size={20} />
            <span className="text-gray-400 text-sm">Avg Trade</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${trades.length > 0 ? (trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / trades.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Zap className={streak.type === 'win' ? 'text-green-400' : 'text-red-400'} size={20} />
            <span className="text-gray-400 text-sm">Current Streak</span>
          </div>
          <p className={`text-2xl font-bold ${streak.type === 'win' ? 'text-green-400' : 'text-red-400'}`}>
            {streak.count} {streak.type === 'win' ? 'Wins' : 'Losses'}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-white" size={20} />
            <span className="text-gray-400 text-sm">Profit Factor</span>
          </div>
          <p className={`text-2xl font-bold ${profitFactor >= 2 ? 'text-green-400' : profitFactor >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
            {profitFactor}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-white" size={20} />
            <span className="text-gray-400 text-sm">Expectancy</span>
          </div>
          <p className={`text-2xl font-bold ${expectancy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${expectancy}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="text-red-400" size={20} />
            <span className="text-gray-400 text-sm">Max Drawdown</span>
          </div>
          <p className="text-2xl font-bold text-red-400">
            ${maxDrawdown.amount} ({maxDrawdown.percentage}%)
          </p>
        </div>
      </div>

      {/* Pair Performance */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Performance by Pair</h3>
        {pairData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Pair</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Trades</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Total P/L</th>
                </tr>
              </thead>
              <tbody>
                {pairData.map((pair, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{pair.pair}</td>
                    <td className="py-3 px-4 text-right text-white">{pair.count}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={pair.winRate >= 50 ? 'text-green-400' : 'text-red-400'}>
                        {pair.winRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={pair.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${pair.totalPnL.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No trade data available</p>
        )}
      </div>

      {/* Monthly Performance */}
      {monthlyPerformance.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="pnl" fill="var(--accent-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekday Distribution */}
      {weekdayDistribution.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Performance by Day of Week</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Day</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Trades</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Total P/L</th>
                </tr>
              </thead>
              <tbody>
                {weekdayDistribution.map((day, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{day.day}</td>
                    <td className="py-3 px-4 text-right text-white">{day.tradeCount}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={day.winRate >= 50 ? 'text-green-400' : 'text-red-400'}>
                        {day.winRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={day.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${day.pnl}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hourly Performance Chart */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Trading Activity by Hour</h3>
        {activeHours.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="hour" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="trades" fill="var(--accent-primary)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 py-8">No hourly data available</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;
