import React, { useState } from 'react';
import { Search, Download, TrendingUp, TrendingDown, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useTradeContext } from '../context/TradeContext';
import { formatCurrency } from '../utils/calculations';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const TradeLog = ({ onEditTrade }) => {
  const { getAccountTrades, deleteTrade } = useTradeContext();
  const allTrades = getAccountTrades();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState(null);

  // Filter and sort trades
  let filteredTrades = allTrades.filter(trade => {
    const matchesSearch = trade.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        return (a.asset || '').localeCompare(b.asset || '');
      default:
        return 0;
    }
  });

  const handleDeleteClick = (trade) => {
    setTradeToDelete(trade);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (tradeToDelete) {
      deleteTrade(tradeToDelete.id);
    }
    setShowDeleteConfirm(false);
    setTradeToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Trade Log</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complete history of all your trades</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search trades..."
              className="input w-full pl-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Outcome */}
          <select
            className="select text-sm"
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
            className="select text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="pnl">Sort by P/L</option>
            <option value="pair">Sort by Pair</option>
          </select>

          {/* Export Button */}
          <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card py-4">
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Total Trades</p>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{filteredTrades.length}</p>
        </div>
        <div className="card py-4">
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Wins</p>
          <p className="text-xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
            {filteredTrades.filter(t => t.outcome === 'Win').length}
          </p>
        </div>
        <div className="card py-4">
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Losses</p>
          <p className="text-xl font-bold" style={{ color: 'var(--accent-danger)' }}>
            {filteredTrades.filter(t => t.outcome === 'Loss').length}
          </p>
        </div>
        <div className="card py-4">
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Total P/L</p>
          <p className={`text-xl font-bold`} style={{
            color: filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) >= 0 
              ? 'var(--accent-secondary)' 
              : 'var(--accent-danger)'
          }}>
            {formatCurrency(filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0))}
          </p>
        </div>
      </div>

      {/* Trade List */}
      <div className="space-y-3">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div key={trade.id} className="card py-4 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {trade.asset || 'Unknown Pair'}
                    </h3>
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: trade.outcome === 'Win' 
                          ? 'rgba(38, 166, 154, 0.15)' 
                          : trade.outcome === 'Loss'
                          ? 'rgba(239, 83, 80, 0.15)'
                          : 'rgba(120, 123, 134, 0.15)',
                        color: trade.outcome === 'Win'
                          ? 'var(--accent-secondary)'
                          : trade.outcome === 'Loss'
                          ? 'var(--accent-danger)'
                          : 'var(--text-secondary)'
                      }}
                    >
                      {trade.outcome}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: trade.direction === 'Long' 
                          ? 'rgba(41, 98, 255, 0.15)' 
                          : 'rgba(156, 39, 176, 0.15)',
                        color: trade.direction === 'Long'
                          ? '#2962ff'
                          : '#ab47bc'
                      }}
                    >
                      {trade.direction}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Entry</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>${trade.entryPrice || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Exit</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>${trade.exitPrice || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Lot Size</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{trade.positionSize || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>R:R</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{trade.riskReward || 0}R</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Date</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {new Date(trade.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {trade.notes && (
                    <div className="mt-3 p-2 rounded text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {trade.notes}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    {(trade.pnl || 0) >= 0 ? (
                      <TrendingUp size={18} style={{ color: 'var(--accent-secondary)' }} />
                    ) : (
                      <TrendingDown size={18} style={{ color: 'var(--accent-danger)' }} />
                    )}
                    <p className="text-lg font-bold" style={{
                      color: (trade.pnl || 0) >= 0 ? 'var(--accent-secondary)' : 'var(--accent-danger)'
                    }}>
                      {formatCurrency(trade.pnl || 0)}
                    </p>
                  </div>
                  
                  {/* Edit/Delete Buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditTrade(trade)}
                      className="p-2 rounded transition-colors"
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)'
                      }}
                      title="Edit trade"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(trade)}
                      className="p-2 rounded transition-colors"
                      style={{ 
                        backgroundColor: 'rgba(239, 83, 80, 0.1)',
                        color: 'var(--accent-danger)'
                      }}
                      title="Delete trade"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }}>No trades found matching your filters</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Trade"
        message={`Are you sure you want to delete this ${tradeToDelete?.asset || ''} trade? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setTradeToDelete(null);
        }}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default TradeLog;
