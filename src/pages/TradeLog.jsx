import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Filter,
  X,
  Calendar,
  Tag,
  Target,
  ChevronRight,
  Database,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useTradeContext } from "../context/TradeContext";
import { formatCurrency } from "../utils/calculations";
import { OUTCOMES, STRATEGIES, TRADE_TAGS } from "../utils/constants";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useData } from "../context/DataContext";

/**
 * TradeLog Component - Technical Ledger
 * Implements a high-density, auditable record of all trading operations.
 * Design: High-precision glassmorphism with technical minimalism.
 */
const TradeLog = ({ onEditTrade }) => {
  const { getAccountTrades, deleteTrade, selectedAccount, currencySymbol } = useTradeContext();
  const { exportToCSV } = useData();
  const allTrades = getAccountTrades();

  // Basic Filtering & UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);

  // Advanced Multi-select Filters
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Modal / Confirm States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState(null);

  const toggleFilter = (list, item, setter) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSelectedOutcomes([]);
    setSelectedStrategies([]);
    setSelectedTags([]);
  };

  const isFiltered =
    searchTerm !== "" ||
    dateRange.start !== "" ||
    dateRange.end !== "" ||
    selectedOutcomes.length > 0 ||
    selectedStrategies.length > 0 ||
    selectedTags.length > 0;

  // Optimized Filter/Sort Engine
  const filteredTrades = useMemo(() => {
    let result = allTrades.filter((trade) => {
      const matchesSearch =
        trade.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const tradeDate = new Date(trade.date).toISOString().split("T")[0];
      const matchesDate =
        (!dateRange.start || tradeDate >= dateRange.start) &&
        (!dateRange.end || tradeDate <= dateRange.end);

      const matchesOutcome =
        selectedOutcomes.length === 0 || selectedOutcomes.includes(trade.outcome);

      const matchesStrategy =
        selectedStrategies.length === 0 || selectedStrategies.includes(trade.strategy);

      const matchesTags =
        selectedTags.length === 0 ||
        (trade.tags && selectedTags.some((t) => trade.tags.includes(t)));

      return matchesSearch && matchesDate && matchesOutcome && matchesStrategy && matchesTags;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "pnl":
          return (b.pnl || 0) - (a.pnl || 0);
        case "pair":
          return (a.asset || "").localeCompare(b.asset || "");
        default:
          return 0;
      }
    });
  }, [allTrades, searchTerm, dateRange, selectedOutcomes, selectedStrategies, selectedTags, sortBy]);

  const handleDeleteClick = (trade) => {
    setTradeToDelete(trade);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (tradeToDelete) deleteTrade(tradeToDelete.id);
    setShowDeleteConfirm(false);
    setTradeToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 pb-24">
      {/* Ledger Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Database className="text-blue-500" size={20} />
            Trade Log
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Account: {selectedAccount?.id.slice(0, 8).toUpperCase() || "MAIN"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={14} />
            <input
              type="text"
              placeholder="SEARCH_TRADES..."
              className="input w-48 lg:w-64 pl-9 py-2 text-[10px] font-bold uppercase tracking-widest bg-slate-950/40 border-white/5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-[10px] font-black uppercase tracking-[0.15em] ${
              showFilters
                ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20"
            }`}
          >
            <Filter size={14} />
            {showFilters ? "Filters_Active" : "Advanced"}
            {isFiltered && <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />}
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-[0.15em]"
          >
            <Download size={14} />
            CSV_EXPORT
          </button>
        </div>
      </div>

      {/* Filter Panel (Technical Module) */}
      {showFilters && (
        <div className="card border-blue-500/20 bg-blue-500/[0.02] p-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FilterSection label="Date Range" icon={Calendar}>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  className="input flex-1 py-1.5 text-[10px] font-bold bg-slate-900 border-white/5"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <span className="text-slate-700 font-black text-[10px]">TO</span>
                <input
                  type="date"
                  className="input flex-1 py-1.5 text-[10px] font-bold bg-slate-900 border-white/5"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </FilterSection>

            <FilterSection label="Trade Outcome" icon={Target}>
              <div className="flex flex-wrap gap-2">
                {OUTCOMES.map((o) => (
                  <FilterChip
                    key={o}
                    label={o}
                    isActive={selectedOutcomes.includes(o)}
                    onClick={() => toggleFilter(selectedOutcomes, o, setSelectedOutcomes)}
                    color="emerald"
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection label="Trade Tags" icon={Tag}>
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                {TRADE_TAGS.map((t) => (
                  <FilterChip
                    key={t}
                    label={t}
                    isActive={selectedTags.includes(t)}
                    onClick={() => toggleFilter(selectedTags, t, setSelectedTags)}
                    color="amber"
                  />
                ))}
              </div>
            </FilterSection>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sorting Order:</span>
              <select
                className="bg-transparent border-none text-[10px] font-black text-blue-400 uppercase tracking-widest cursor-pointer outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sequential_Time</option>
                <option value="pnl">Magnitude_Return</option>
                <option value="pair">Alpha_Sort</option>
              </select>
            </div>
            <button
              onClick={clearFilters}
              disabled={!isFiltered}
              className="flex items-center gap-2 text-[9px] font-black text-rose-500/60 hover:text-rose-500 transition-colors disabled:opacity-20 uppercase tracking-widest"
            >
              <X size={12} />
              Reset_Filters
            </button>
          </div>
        </div>
      )}

      {/* High-Density Ledger Table */}
      <div className="card p-0 overflow-hidden border-white/5 bg-slate-950/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="py-4 px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] w-12 text-center">Status</th>
                <th className="py-4 px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Entity</th>
                <th className="py-4 px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Trade_Data</th>
                <th className="py-4 px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Metrics</th>
                <th className="py-4 px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Result</th>
                <th className="py-4 px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrades.length > 0 ? (
                filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 px-6 text-center">
                      <div
                        className={`w-2 h-2 rounded-full mx-auto shadow-[0_0_10px] ${
                          trade.outcome === "Win"
                            ? "bg-emerald-500 shadow-emerald-500/40"
                            : trade.outcome === "Loss"
                            ? "bg-rose-500 shadow-rose-500/40"
                            : "bg-slate-600 shadow-slate-600/40"
                        }`}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tighter uppercase data-mono">
                          {trade.asset}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${
                              trade.direction === "Long"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                            }`}
                          >
                            {trade.direction}
                          </span>
                          <span className="text-[8px] font-bold text-slate-600 uppercase data-mono">
                            {new Date(trade.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter w-8">IN:</span>
                          <span className="text-[11px] font-bold text-slate-300 data-mono">{currencySymbol}{trade.entryPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter w-8">OUT:</span>
                          <span className="text-[11px] font-bold text-slate-300 data-mono">
                            {trade.exits && trade.exits.length > 0 ? "PARTIAL" : `${currencySymbol}${trade.exitPrice?.toLocaleString() || "..."}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter w-8">VOL:</span>
                          <span className="text-[11px] font-bold text-slate-300 data-mono">{trade.positionSize}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter w-8">STRAT:</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-[80px]">
                            {trade.strategy || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-[11px] font-black text-emerald-400 data-mono tracking-tighter">
                          {trade.riskReward}R
                        </span>
                        <div className="w-12 h-0.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            style={{ width: `${Math.min(parseFloat(trade.riskReward || 0) * 20, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-base font-black data-mono tracking-tighter ${
                            (trade.pnl || 0) >= 0 ? "text-emerald-400 text-glow-success" : "text-rose-400 text-glow-danger"
                          }`}
                        >
                          {(trade.pnl || 0) >= 0 ? "+" : ""}
                          {formatCurrency(trade.pnl || 0, currencySymbol)}
                        </span>
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {(trade.pnl || 0) >= 0 ? <ArrowUpRight size={10} className="text-emerald-500" /> : <ArrowDownRight size={10} className="text-rose-500" />}
                          <span className="text-[8px] font-bold text-slate-500 uppercase">SAVED</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => onEditTrade(trade)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-xl"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trade)}
                          className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all shadow-xl"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Activity className="mx-auto text-slate-800 mb-4" size={48} />
                    <p className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">No_Trades_Matched</p>
                    {isFiltered && (
                      <button onClick={clearFilters} className="mt-4 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">
                        Bypass_Filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Protocol: Data_Deletion"
        message={`Confirm permanent deletion of trade ${tradeToDelete?.asset} [${tradeToDelete?.id.slice(0, 8)}]. This action modifies historical account trajectory.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setTradeToDelete(null);
        }}
        confirmText="Confirm_Purge"
        variant="danger"
      />
    </div>
  );
};

// Sub-components for Ledger Modular UI
const FilterSection = ({ label, icon: Icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
      <Icon size={12} className="text-blue-500" />
      {label}
    </div>
    {children}
  </div>
);

const FilterChip = ({ label, isActive, onClick, color }) => {
  const styles = {
    emerald: isActive ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/10 text-slate-600",
    amber: isActive ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-white/5 border-white/10 text-slate-600",
    blue: isActive ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-white/5 border-white/10 text-slate-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${styles[color] || styles.blue}`}
    >
      {label}
    </button>
  );
};

export default TradeLog;
