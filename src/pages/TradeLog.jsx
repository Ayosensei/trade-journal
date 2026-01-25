import React, { useState } from 'react';
import { Search, Filter, Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useTradeContext } from '../context/TradeContext';
import { formatCurrency } from '../utils/calculations';

const TradeLog = () => {
  const { getAccountTrades } = useTradeContext();
  const allTrades = getAccountTrades();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Filter and sort trades
  let filteredTrades = allTrades.filter(trade => {
    const matchesSearch = trade.pair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterOutcome === 'all' || trade.outcome === filterOutcome;
    return matchesSearch && matchesFilter;
  });

  // Sort trades
  filteredTrades = [...filteredTrades].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'pnl':
        return (b.pnl || 0) - (a.pnl || 0);
      case 'pair':
        return (a.pair || '').localeCompare(b.pair || '');
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Trade Log</h2>
        <p className="text-gray-400">Complete history of all your trades</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search trades..."
              className="input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Outcome */}
          <select
            className="select"
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
          >
            <option value="all">All Outcomes</option>
            <option value="Win">Wins Only</option>
            <option value="Loss">Losses Only</option>
            <option value="Breakeven">Breakeven</option>
          </select>

          {/* Sort By */}
          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="pnl">Sort by P/L</option>
            <option value="pair">Sort by Pair</option>
          </select>

          {/* Export Button */}
          <button className="btn-secondary flex items-center justify-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{filteredTrades.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Wins</p>
          <p className="text-2xl font-bold text-green-400">
            {filteredTrades.filter(t => t.outcome === 'Win').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Losses</p>
          <p className="text-2xl font-bold text-red-400">
            {filteredTrades.filter(t => t.outcome === 'Loss').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-400 mb-1">Total P/L</p>
          <p className={`text-2xl font-bold ${
            filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0))}
          </p>
        </div>
      </div>

      {/* Trade List */}
      <div className="space-y-4">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div key={trade.id} className="card hover:border-white/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{trade.pair || 'Unknown Pair'}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.outcome === 'Win'
                        ? 'bg-green-500/20 text-green-400'
                        : trade.outcome === 'Loss'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {trade.outcome}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.direction === 'Long'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {trade.direction}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Entry</p>
                      <p className="text-white font-medium">${trade.entryPrice || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Exit</p>
                      <p className="text-white font-medium">${trade.exitPrice || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Position Size</p>
                      <p className="text-white font-medium">{trade.positionSize || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">R:R</p>
                      <p className="text-white font-medium">{trade.riskReward || 0}R</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p className="text-white font-medium">
                        {new Date(trade.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {trade.notes && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-300">{trade.notes}</p>
                    </div>
                  )}
                </div>

                <div className="ml-6 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {(trade.pnl || 0) >= 0 ? (
                      <TrendingUp className="text-green-400" size={20} />
                    ) : (
                      <TrendingDown className="text-red-400" size={20} />
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${
                    (trade.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(trade.pnl || 0)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-400">No trades found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeLog;
