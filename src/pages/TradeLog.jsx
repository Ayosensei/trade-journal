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
} from "lucide-react";
import { useTradeContext } from "../context/TradeContext";
import { formatCurrency } from "../utils/calculations";
import { OUTCOMES, STRATEGIES, TRADE_TAGS } from "../utils/constants";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useData } from "../context/DataContext";

const TradeLog = ({ onEditTrade }) => {
  const { getAccountTrades, deleteTrade } = useTradeContext();
  const { exportToCSV } = useData();
  const allTrades = getAccountTrades();

  // Search & Basic Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState(null);

  const toggleFilter = (list, item, setter) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
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

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    let result = allTrades.filter((trade) => {
      // Search text
      const matchesSearch =
        trade.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      // Date Range
      const tradeDate = new Date(trade.date).toISOString().split("T")[0];
      const matchesDate =
        (!dateRange.start || tradeDate >= dateRange.start) &&
        (!dateRange.end || tradeDate <= dateRange.end);

      // Multi-select Outcome
      const matchesOutcome =
        selectedOutcomes.length === 0 ||
        selectedOutcomes.includes(trade.outcome);

      // Multi-select Strategy
      const matchesStrategy =
        selectedStrategies.length === 0 ||
        selectedStrategies.includes(trade.strategy);

      // Multi-select Tags
      const matchesTags =
        selectedTags.length === 0 ||
        (trade.tags && selectedTags.some((t) => trade.tags.includes(t)));

      return (
        matchesSearch &&
        matchesDate &&
        matchesOutcome &&
        matchesStrategy &&
        matchesTags
      );
    });

    // Sort
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "pnl":
          return (b.pnl || 0) - (a.pnl || 0);
        case "pair":
          return (a.asset || "").localeCompare(b.asset || "");
        default:
          return 0;
      }
    });
  }, [
    allTrades,
    searchTerm,
    dateRange,
    selectedOutcomes,
    selectedStrategies,
    selectedTags,
    sortBy,
  ]);

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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Trade Ledger</h2>
          <p className="text-sm text-gray-400">
            Auditable history of every execution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-bold uppercase tracking-wider ${showFilters ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"}`}
          >
            <Filter size={16} />
            {showFilters ? "Hide Filters" : "Advanced Filters"}
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-bold uppercase tracking-wider"
          >
            <Download size={16} />
            CSV Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card py-6 border-l-2 border-blue-500">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Total Result
          </p>
          <p className="text-2xl font-bold text-white">
            {filteredTrades.length} Trades
          </p>
        </div>
        <div className="card py-6 border-l-2 border-emerald-500">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Win Rate
          </p>
          <p className="text-2xl font-bold text-emerald-400">
            {filteredTrades.length > 0
              ? (
                  (filteredTrades.filter((t) => t.outcome === "Win").length /
                    filteredTrades.length) *
                  100
                ).toFixed(1)
              : "0"}
            %
          </p>
        </div>
        <div className="card py-6 border-l-2 border-rose-500">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Avg P/L
          </p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(
              filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) /
                (filteredTrades.length || 1),
            )}
          </p>
        </div>
        <div className="card py-6 border-l-2 border-amber-500">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Net Flow
          </p>
          <p
            className={`text-2xl font-bold ${filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}
          >
            {formatCurrency(
              filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0),
            )}
          </p>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-6 bg-slate-900 border-white/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Search & Date */}
            <div className="space-y-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Asset or note content..."
                  className="input w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> Date Range
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    className="input flex-1 text-xs"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="date"
                    className="input flex-1 text-xs"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Outcomes & Sorting */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Sort By
                </label>
                <select
                  className="select w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Most Recent</option>
                  <option value="pnl">Highest P/L</option>
                  <option value="pair">Asset Name</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Outcome
                </label>
                <div className="flex flex-wrap gap-2">
                  {OUTCOMES.map((o) => (
                    <button
                      key={o}
                      onClick={() =>
                        toggleFilter(selectedOutcomes, o, setSelectedOutcomes)
                      }
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${selectedOutcomes.includes(o) ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/10 text-gray-500"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategies & Tags */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Target size={12} /> Strategy
                </label>
                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto pr-2 custom-scrollbar">
                  {STRATEGIES.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        toggleFilter(
                          selectedStrategies,
                          s,
                          setSelectedStrategies,
                        )
                      }
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-all ${selectedStrategies.includes(s) ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-white/5 border-white/10 text-gray-500"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={12} /> Behavior Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto pr-2 custom-scrollbar">
                  {TRADE_TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        toggleFilter(selectedTags, t, setSelectedTags)
                      }
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-all ${selectedTags.includes(t) ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-white/5 border-white/10 text-gray-500"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              onClick={clearFilters}
              disabled={!isFiltered}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <X size={14} />
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Trade List */}
      <div className="space-y-4">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="card group hover:border-white/20 transition-all p-0 overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Result Color Bar */}
                <div
                  className={`w-1.5 ${trade.outcome === "Win" ? "bg-emerald-500" : trade.outcome === "Loss" ? "bg-rose-500" : "bg-gray-600"}`}
                />

                <div className="flex-1 p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Asset & Identity */}
                      <div className="flex items-center flex-wrap gap-3">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {trade.asset}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${trade.direction === "Long" ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" : "bg-purple-600/20 text-purple-400 border border-purple-600/30"}`}
                          >
                            {trade.direction}
                          </span>
                          {trade.strategy && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-400 border border-white/10">
                              {trade.strategy}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(trade.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Execution Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                            Entry
                          </p>
                          <p className="text-sm font-bold text-white">
                            ${trade.entryPrice?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                            Exit
                          </p>
                          <p className="text-sm font-bold text-white">
                            {trade.exits && trade.exits.length > 0
                              ? `${trade.exits.length} Levels`
                              : trade.exitPrice
                                ? `$${trade.exitPrice.toLocaleString()}`
                                : "Active"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                            Position
                          </p>
                          <p className="text-sm font-bold text-white">
                            {trade.positionSize} Units
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                            Efficiency
                          </p>
                          <p className="text-sm font-bold text-emerald-400">
                            {trade.riskReward}R
                          </p>
                        </div>
                      </div>

                      {/* Tags & Psychology */}
                      <div className="flex flex-wrap items-center gap-2">
                        {trade.emotionalState && (
                          <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] text-gray-300 border border-white/5 italic">
                            Mood: {trade.emotionalState}
                          </span>
                        )}
                        {trade.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-amber-400/5 text-amber-500 border border-amber-400/10 rounded-md text-[10px] font-bold uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {trade.notes && (
                        <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5 border-dashed line-clamp-2 italic">
                          "{trade.notes}"
                        </p>
                      )}
                    </div>

                    {/* Financial Outcome & Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-8 min-w-[150px]">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                          Return
                        </p>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-2xl font-black ${trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                          >
                            {formatCurrency(trade.pnl || 0)}
                          </p>
                          {trade.pnl >= 0 ? (
                            <TrendingUp
                              size={20}
                              className="text-emerald-500"
                            />
                          ) : (
                            <TrendingDown size={20} className="text-rose-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditTrade(trade)}
                          className="p-2.5 rounded-lg bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all border border-white/5"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trade)}
                          className="p-2.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 transition-all border border-rose-600/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-20 flex flex-col items-center">
            <Search className="mb-4 text-gray-600" size={48} />
            <p className="text-lg font-bold text-white mb-1">
              No matches found
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            {isFiltered && (
              <button onClick={clearFilters} className="btn-secondary">
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Permanently Delete Trade?"
        message={`This action will remove the record of ${tradeToDelete?.asset} from your historical data. Your account balance will be adjusted accordingly.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setTradeToDelete(null);
        }}
        confirmText="Delete Record"
        variant="danger"
      />
    </div>
  );
};

export default TradeLog;
